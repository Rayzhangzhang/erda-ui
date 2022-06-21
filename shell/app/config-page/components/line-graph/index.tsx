// Copyright (c) 2021 Terminus, Inc.
//
// This program is free software: you can use, redistribute, and/or modify
// it under the terms of the GNU Affero General Public License, version 3
// or later ("AGPL"), as published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

import React from 'react';
import Echarts from 'charts/components/echarts';
import type { ECharts } from 'echarts';
import { genLinearGradient, theme } from 'charts/theme';
import EmptyHolder from 'common/components/empty-holder';
import themeColors from 'app/theme-color';
import { formatValue } from 'charts/utils';

interface IBrushSelectedParams {
  type: 'brushselected';
  batch: Array<{
    areas: Array<{
      coordRange: number[];
      coordRanges: number[][];
    }>;
  }>;
}

const themeColor = {
  dark: () => '#ffffff',
  light: (opacityValue: number) => themeColors.default({ opacityValue: opacityValue || 1 }),
};

const LineGraph: React.FC<CP_LINE_GRAPH.Props> = (props) => {
  const { props: configProps, data, operations, execOperation, customOp } = props;
  const color = themeColor[configProps.theme ?? 'light'];
  const chartRef = React.useRef<ECharts>();
  const dataRef = React.useRef(data);
  dataRef.current = data;

  const clearBrush = () => {
    if (chartRef.current) {
      chartRef.current.dispatchAction({
        type: 'brush',
        areas: [],
      });
    }
  };

  const [option, onEvents] = React.useMemo(() => {
    const { dimensions, xAxis, yAxis, yOptions, xOptions } = data;
    const xAxisData = xAxis?.values || [];
    const chartOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: (param: any[]) => {
          const { axisValue } = param[0] || [];
          const xStructure = xOptions?.structure || { type: 'string', precision: '' };
          const tips = [`${formatValue(xStructure.type, xStructure.precision, axisValue)}`];
          param.forEach((item) => {
            const { structure } = yOptions.find((t) => t.dimension?.includes(item.seriesName)) ?? yOptions[0];
            tips.push(
              `${item.marker} ${item.seriesName}: ${formatValue(structure.type, structure.precision, item.data)}`,
            );
          });
          return tips.join('</br>');
        },
      },
      grid: {
        containLabel: true,
        left: 30,
        bottom: 30,
        top: 10,
        right: 0,
      },
      legend: {
        data: (dimensions ?? []).map((item) => ({
          name: item,
          textStyle: {
            color: color(0.6),
          },
          icon: 'reat',
          itemWidth: 12,
          itemHeight: 3,
          type: 'scroll',
        })),
        bottom: true,
      },
      xAxis: {
        data: xAxisData,
        axisLabel: {
          color: color(0.6),
          formatter:
            xOptions?.structure?.enable && xAxisData.length
              ? (v: number) =>
                  formatValue(
                    xOptions?.structure.type,
                    xOptions?.structure.precision,
                    v,
                    xAxisData[0],
                    xAxisData[xAxisData.length - 1],
                  )
              : undefined,
        },
        splitLine: {
          show: false,
        },
      },
      yAxis: (yOptions ?? []).map(({ structure }) => {
        const { enable, type, precision } = structure;
        return {
          type: 'value',
          axisLabel: {
            color: color(0.3),
            formatter: enable ? (v: number) => formatValue(type, precision, v) : undefined,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: [color(0.1)],
            },
          },
        };
      }),
      series: (yAxis ?? []).map((item, index) => {
        let temp = {};
        if (index === 0) {
          temp = {
            areaStyle: {
              normal: {
                color: genLinearGradient(theme.color[0]),
              },
            },
          };
        }
        return {
          type: 'line',
          name: item.dimension,
          data: item.values,
          ...temp,
        };
      }),
    };
    clearBrush();
    const chartEvents = {};
    if (operations?.onSelect || customOp?.onSelect) {
      Object.assign(chartOption, {
        brush: {
          toolbox: [''],
          throttleType: 'debounce',
          throttleDelay: 300,
          xAxisIndex: 0,
        },
      });
      Object.assign(chartEvents, {
        brushSelected: (params: IBrushSelectedParams) => {
          const { areas } = params.batch[0] ?? {};
          const xAxisValues = dataRef.current.xAxis.values || [];
          if (areas?.length) {
            const { coordRange } = areas[0];
            if (coordRange?.length) {
              const [startIndex, endIndex] = coordRange;
              if (startIndex >= endIndex) {
                clearBrush();
                return;
              }
              const start = xAxisValues[Math.max(startIndex, 0)];
              const end = xAxisValues[Math.min(endIndex, xAxisValues.length - 1)];
              customOp?.onSelect && customOp.onSelect({ start, end });
              operations?.onSelect && execOperation(operations.onSelect, { start, end });
            }
          }
        },
      });
    }
    return [chartOption, chartEvents];
  }, [color, data, operations, customOp]);

  const handleReady = React.useCallback(
    (chart: ECharts) => {
      chartRef.current = chart;
      if (operations?.onSelect || customOp?.onSelect) {
        chart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'brush',
          brushOption: {
            brushType: 'lineX',
            brushMode: 'single',
          },
        });
      }
    },
    [operations?.onSelect, customOp?.onSelect],
  );

  return (
    <div className={`px-4 pb-2 ${configProps.className ?? ''}`} style={{ backgroundColor: color(0.02) }}>
      {data.title ? (
        <div
          className={`title h-12 flex items-center justify-between ${
            configProps.theme === 'dark' ? 'text-white' : 'text-normal'
          }`}
        >
          {data.title}
        </div>
      ) : null}
      <div className={data.title ? '' : 'pt-4'}>
        {option.series.length && option.yAxis.length ? (
          <Echarts
            key={Date.now()} // FIXME render exception occasionally，the exact reason is not yet clear
            onEvents={onEvents}
            onChartReady={handleReady}
            option={option}
            style={{
              width: '100%',
              height: '170px',
              minHeight: 0,
              ...configProps.style,
            }}
          />
        ) : (
          <EmptyHolder relative />
        )}
      </div>
    </div>
  );
};

export default LineGraph;
