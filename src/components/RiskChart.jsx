"use client";
import ReactECharts from 'echarts-for-react';

const RiskChart = ({ data }) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1F2937',
      borderColor: '#374151',
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.month),
      axisLabel: {
        color: '#9CA3AF'
      },
      axisLine: {
        lineStyle: {
          color: '#4B5563'
        }
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        color: '#9CA3AF',
        formatter: '{value}%'
      },
      axisLine: {
        lineStyle: {
          color: '#4B5563'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#374151',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: data.map(item => item.riskScore),
        type: 'line',
        name: 'Risk Score',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: '#8A85FF',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(138, 133, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(138, 133, 255, 0.05)'
              }
            ]
          }
        },
        itemStyle: {
          color: '#8A85FF',
          borderWidth: 2,
          borderColor: '#fff'
        }
      }
    ]
  };

  return (
    <div className="w-full h-[400px]">
      <ReactECharts 
        option={option}
        style={{ height: '100%', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default RiskChart;
