import mmap
from xml.etree import ElementTree as ET
import sys
import json
from fastapi import FastAPI, HTTPException, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import asyncio
from uvicorn import Config, Server




#https://github.com/gwy15/python_aida64
def _readRawData(length):
    with mmap.mmap(
            -1, length,  # anonymous file
            tagname='AIDA64_SensorValues',
            access=mmap.ACCESS_READ) as mm:
        return mm.read()


def _decode(b):
    for encoding in (sys.getdefaultencoding(), 'utf-8', 'gbk'):
        try:
            return b.decode(encoding=encoding)
        except UnicodeDecodeError:
            continue
    return b.decode()


def getXmlRawData() -> str:
    options = [100 * i for i in range(20, 100)]  # ranges in [2k, 10k]
    low = 0
    high = len(options) - 1
    while low < high:  # [low, high], stops at [low, low]
        mid = (low + high) // 2  # legit
        try:
            length = options[mid]
            raw = _readRawData(length)
            if raw[-1] == 0:  # legit ending
                decoded = _decode(raw.rstrip(b'\x00'))
                return '<root>{}</root>'.format(decoded)
            else:  # not long enough
                low = mid
                continue
        except PermissionError:  # illegal length (too long)
            high = mid
            continue


def getData() -> dict:
    data = {}
    tree = ET.fromstring(getXmlRawData())

    for item in tree:
        if item.tag not in data:
            data[item.tag] = []
        data[item.tag].append({
            key: item.find(key).text
            for key in ('id', 'label', 'value')
        })
    return data



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/data")
def getDataApi():
    try:
        data = getData()
        if len(data.keys()) == 0:
            raise Exception("no data")
        return data
    except Exception as e:
        raise HTTPException(status_code=500,detail=str(e))
    

serverConfig = Config(
    app=app,
    host="0.0.0.0",
    port=9017,
    log_level="info",
)
appServer = Server(serverConfig)
asyncio.new_event_loop().run_until_complete(appServer.serve())