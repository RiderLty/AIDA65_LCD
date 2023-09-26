import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import EchartContainer from "./components/EchartsContainer";
import LineChart from "./components/LineChart";
import Grid from "@mui/material/Grid";
import PieChart from "./components/PieChart";
import Paper from "@mui/material/Paper";

const CombinedChart = ({ title, value, clk }) => {
  return (
    <Paper
      elevation={3}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        margin: 12,
        border: 12,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      >
        <LineChart title={title} maxLen={100} value={value} clk={clk} />
      </div>
      <Paper
        elevation={8}
        style={{
          width: "80px",
          height: "80px",
          position: "absolute",
          left: 42,
          top: 20,
          backgroundColor: "#d3d3d3",
          padding: 12,
        }}
      >
        <PieChart title={""} lineWidth={8} value={value} clk={clk} />
      </Paper>
    </Paper>
  );
};

function App() {


  const [data, setData] = useState({
    CPU: 0,
    GPU: 0,
    MEM: 0,
    DISK: 0,
    CLK: 0,
  });

  const getData = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:9017/api/data", {
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
      });
      const data = await resp.json();
      return [null, data];
    } catch (e) {
      console.log(e);
      return [e, null];
    }
  };

  useEffect(() => {
    document.onclick = function (e) {
      document.body.requestFullscreen();
    };

    setInterval(async () => {
      const [err, res] = await getData();
      if (err) {
        console.log(err);
      } else {
        console.log(res)
        setData({
          CPU: Number(res.sys[22].value),
          GPU: Number(res.sys[46].value),
          MEM: Number(res.sys[31].value),
          DISK: Number(res.sys[39].value),
          CLK: Math.random(),
        });
      }
    }, 1000);

    return () => {};
  }, []);

  return (
    <>
      <Grid
        container
        spacing={"12px"}
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        width={"100vw"}
        height={"100vh"}
      >
        <Grid item lg={6} sm={6} width={"40%"} height={"45%"}>
          <CombinedChart title={"CPU使用率"} value={data.CPU} clk={data.CLK} />
        </Grid>
        <Grid item lg={6} sm={6} width={"40%"} height={"45%"}>
          <CombinedChart title={"GPU使用率"} value={data.GPU} clk={data.CLK} />
        </Grid>
        <Grid item lg={6} sm={6} width={"40%"} height={"45%"}>
          <CombinedChart title={"内存使用率"} value={data.MEM} clk={data.CLK} />
        </Grid>
        <Grid item lg={6} sm={6} width={"40%"} height={"45%"}>
          <CombinedChart
            title={"磁盘使用率"}
            value={data.DISK}
            clk={data.CLK}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
