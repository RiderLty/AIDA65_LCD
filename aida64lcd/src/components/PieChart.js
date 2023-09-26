import { useEffect, useState } from "react"
import EchartContainer from "./EchartsContainer"

const defaultColors = [
    { value: 5, color: "#607D8B" },
    { value: 30, color: "#303F9F" },
    { value: 70, color: "#4CAF50" },
    { value: 100, color: "#D32F2F" }
]

export default function PieChart({ title, colors, value, lineWidth ,clk}) {

    const [option, setOption] = useState(
        {
            series: [
                {
                    type: 'gauge',
                    radius: "100%",
                    startAngle: 90,
                    endAngle: -270,
                    pointer: {
                        show: false
                    },
                    progress: {
                        show: true,
                        overlap: false,
                        roundCap: true,
                        clip: false,
                        itemStyle: {
                            borderWidth: 0,
                            borderColor: '#ffffff'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: lineWidth
                        },
                    },
                    splitLine: {
                        show: false,
                        distance: 0,
                        length: 5
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false,
                        distance: 50
                    },
                    data: [
                        {
                            value: 20,
                            name: '',
                            title: {
                                offsetCenter: ['0%', '0%']
                            },
                            itemStyle: {
                                color: "#d90051"
                            },
                            detail: {
                                valueAnimation: true,
                                offsetCenter: ['0%', '0%']
                            }
                        },
                    ],
                    title: {
                        fontSize: 16
                    },
                    detail: {
                        width: 50,
                        height: 16,
                        fontSize: 14,
                        color: "#d90051",
                        borderColor: "#d95051",
                        borderRadius: 20,
                        borderWidth: 1,
                        formatter: '{value}%'
                    }
                }
            ]
        }
    )


    useEffect(() => {
        const colorList = colors ? colors : defaultColors
        
        let itemColor = colorList[0].color
        for (let i = 0 ; i < colorList.length; i++) {
            if (colorList[i].value >= value) {
                itemColor = colorList[i].color
                break
            }
        }
        setOption(
            {
                series: [
                    {
                        data: [
                            {
                                value: value,
                                name: title,
                                title: {
                                    offsetCenter: ['0%', '0%']
                                },
                                itemStyle: {
                                    color: itemColor
                                },
                                detail: {
                                    valueAnimation: true,
                                    offsetCenter: ['0%', '0%']
                                }
                            },
                        ],
                        detail: {
                            color: itemColor,
                            borderColor: "rgba(0,0,0,0)",
                        }
                    }
                ]
            }
        )

    }, [colors, value , clk])

    return <EchartContainer option={option} />
}