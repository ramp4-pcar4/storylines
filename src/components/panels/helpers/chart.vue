<template>
    <div ref="el" class="dv-chart justify-center flex align-middle" dv-config="config">
        <div
            class="dv-chart-container items-stretch h-full w-full"
            role="region"
            aria-hidden="false"
            :aria-label="title"
            v-if="!loading"
        >
            <highchart :options="chartOptions"></highchart>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { inject, onMounted, ref } from 'vue';
import type {
    ChartPanel,
    ConfigFileStructure,
    DQVChartConfig,
    LineSeriesData,
    PieSeriesData
} from '@storylines/definitions';
import { useI18n } from 'vue-i18n';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';
import exporting from 'highcharts/modules/exporting';
import exportData from 'highcharts/modules/export-data';
import patternFill from 'highcharts/modules/pattern-fill';

dataModule(Highcharts);
exporting(Highcharts);
exportData(Highcharts);
patternFill(Highcharts);

interface CSVFile {
    url: string;
}

interface CSVDataRow {
    [column: string]: string | number;
}

const emit = defineEmits(['loaded']);

const props = defineProps({
    config: {
        type: Object as PropType<ChartPanel>,
        required: true
    },
    configFileStructure: {
        type: Object as PropType<ConfigFileStructure>
    }
});

const { t } = useI18n();
const el = ref();

const chartOptions = ref<DQVChartConfig>({} as DQVChartConfig);
const title = ref('');
const loading = ref(true);

const menuOptions = [
    'viewFullscreen',
    'printChart',
    'separator',
    'downloadPNG',
    'downloadJPEG',
    'downloadPDF',
    'downloadSVG',
    'separator',
    'downloadCSV',
    'downloadXLS'
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $papa: any = inject('$papa');

// add FR translations strings to highcharts configuration as required
const menuLabels = {
    viewFullscreen: t('chart.viewFullscreen'),
    printChart: t('chart.printChart'),
    downloadPNG: t('chart.downloadPNG'),
    downloadJPEG: t('chart.downloadJPEG'),
    downloadPDF: t('chart.downloadPDF'),
    downloadSVG: t('chart.downloadSVG'),
    downloadCSV: t('chart.downloadCSV'),
    downloadXLS: t('chart.downloadXLS'),
    viewData: t('chart.viewData')
};

onMounted(() => {
    const isMobile = el.value.clientWidth <= 640;

    // If the client width is over 640 (not on mobile), add the `View Data Table` option to charts.
    if (!isMobile) {
        menuOptions.push('viewData');
    }

    if (props.config.config) {
        // configured JSON structure if exists - for highcharts demo purposes
        chartOptions.value = props.config.config;
        title.value = chartOptions.value.title.text;
        loading.value = false;

        // Set up hamburger menu options.
        chartOptions.value.lang = menuLabels;
        if (chartOptions.value.exporting) {
            chartOptions.value.exporting.buttons = {
                contextButton: {
                    menuItems: menuOptions
                }
            };
        } else {
            chartOptions.value.exporting = {
                buttons: {
                    contextButton: {
                        menuItems: menuOptions
                    }
                }
            };
        }
    } else if (props.config.src) {
        // get input given by src path
        const extension = props.config.src.split('.').pop();
        const assetSrc = `${props.config.src.substring(props.config.src.indexOf('/') + 1)}`;

        if (extension === 'json') {
            if (props.configFileStructure) {
                // attempt to fetch JSON file from ZIP folder
                const chartJsonFile = props.configFileStructure.zip.file(assetSrc);
                if (chartJsonFile) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    chartJsonFile.async('string').then((res: string) => {
                        const jsonData: DQVChartConfig = JSON.parse(res);
                        parseJSONFile(jsonData);
                    });
                }
            } else {
                fetch(props.config.src).then((data) => {
                    // parse JSON data
                    data.json().then(
                        (res: DQVChartConfig) => {
                            parseJSONFile(res);
                        },
                        (err) => {
                            console.error(`Error fetching chart JSON file: ${err}`);
                        }
                    );
                });
            }
        } else if (extension === 'csv') {
            if (props.configFileStructure) {
                // First attempt to fetch the configuration file from the ZIP folder.
                const chartCsvFile = props.configFileStructure.zip.file(assetSrc);
                if (chartCsvFile) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    chartCsvFile.async('blob').then((res: any) => {
                        parseCSVFile(res);
                    });
                }
            } else {
                // if data is hosted on server can simply be passed into chartOptions under csvUrl (local file needs to be parsed)
                fetch(props.config.src).then((data) => {
                    parseCSVFile(data);
                });
            }
        }
    }
});

/**
 * Parse and process CSV file contents and return a properly configured highcharts options object.
 */
const parseJSONFile = (jsonData: DQVChartConfig): void => {
    chartOptions.value = jsonData;
    title.value = chartOptions.value.title.text;
    loading.value = false;

    // Set up hamburger menu options.
    chartOptions.value.lang = menuLabels;
    if (chartOptions.value.exporting) {
        chartOptions.value.exporting.buttons = {
            contextButton: {
                menuItems: menuOptions
            }
        };
    } else {
        chartOptions.value.exporting = {
            buttons: {
                contextButton: {
                    menuItems: menuOptions
                }
            }
        };
    }

    emit('loaded', chartOptions.value);
};

/**
 * Parse and process CSV file contents and return a properly configured highcharts options object.
 */
const parseCSVFile = (data: CSVFile): void => {
    const dqvOptions = props.config.options;

    // export options displayed on hamburger menu
    const exportOptions = {
        buttons: {
            contextButton: {
                menuItems: menuOptions
            }
        },
        enabled: dqvOptions?.export !== undefined ? dqvOptions?.export : true
    };

    // extract general chart options that applies to all chart types
    const defaultOptions = {
        lang: {
            menuLabels
        },
        chart: {
            renderTo: 'dv-chart-container',
            type: dqvOptions?.type,
            ...(dqvOptions?.height &&
                el.value?.clientHeight >= dqvOptions.height && {
                    height: dqvOptions.height
                }),
            ...(dqvOptions?.width && el.value.clientWidth >= dqvOptions.width && { width: dqvOptions.width })
        },
        ...(dqvOptions?.title && { title: { text: dqvOptions?.title } }),
        ...(dqvOptions?.subtitle && { subtitle: { text: dqvOptions?.subtitle } }),
        ...(dqvOptions?.colours && { colors: dqvOptions?.colours }),
        exporting: exportOptions,
        credits: {
            enabled: dqvOptions?.credits !== undefined ? dqvOptions?.credits : false
        }
    };

    // download: true needed for local files which is treated as an URL
    $papa.parse(data.url ? data.url : data, {
        header: dqvOptions?.type === 'pie' ? false : true,
        dynamicTyping: true,
        download: !!data.url,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        complete: (res: any) => {
            // construct highcharts objects based on chart type
            if (dqvOptions?.type === 'pie') {
                // eslint-disable-next-line prettier/prettier
                makePieChart(res.data, defaultOptions as DQVChartConfig);
            } else {
                // eslint-disable-next-line prettier/prettier
                makeLineChart(res.meta.fields, res.data, defaultOptions as DQVChartConfig);
            }
        }
    });

    loading.value = false;
};

/**
 * Parse chart data content and return a highcharts formatted series object for a pie chart.
 */
const makePieChart = (csvData: CSVDataRow[], defaultOptions: DQVChartConfig): void => {
    let series: PieSeriesData = { name: '', data: [] };

    // construct series data
    series.name = csvData[0][0] as string;
    const ylabel = csvData[0][1];
    csvData.slice(1).forEach((slice: CSVDataRow) => {
        series.data.push({
            name: slice[0] as string,
            // in case of strings being passed in such as '10%'
            y: parseFloat(slice[1] as string)
        });
    });

    // plot options for pie charts
    const plotOptions = {
        pie: {
            name: '',
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
        }
    };

    // initializing chartOptions for line/bar charts
    chartOptions.value = {
        ...defaultOptions,
        plotOptions: plotOptions,
        series: series,
        yAxis: {
            title: {
                text: ylabel as string
            }
        }
    };
    emit('loaded', chartOptions.value);
};

/**
 * Parse chart data content and return a highcharts formatted series object for a line/bar chart.
 */
const makeLineChart = (fields: string[], csvData: CSVDataRow[], defaultOptions: DQVChartConfig): void => {
    const dqvOptions = props.config.options;
    // find xAxis categories for line/bar charts
    const cato = fields.shift() as string;
    const xAxis = {
        title: {
            text: dqvOptions?.xAxisLabel ? dqvOptions?.xAxisLabel : ''
        },
        categories: csvData.map((row: CSVDataRow) => row[cato])
    };

    // construct series data
    let series: LineSeriesData[] = [];
    fields.forEach((f: string) => {
        const colData = csvData.map((row: CSVDataRow) => row[f]);
        series.push({
            name: f,
            data: colData as number[]
        });
    });

    // initializing chartOptions for line/bar charts
    chartOptions.value = {
        ...defaultOptions,
        series: series,
        xAxis: xAxis,
        yAxis: {
            title: {
                text: dqvOptions?.yAxisLabel ? dqvOptions?.yAxisLabel : ''
            }
        }
    };
    emit('loaded', chartOptions.value);
};
</script>

<style lang="scss">
.dv-chart-container {
    overflow: hidden;
}
.highcharts-data-table table {
    background: white;
    width: 100%;
    margin-bottom: 20px;
}
.highcharts-table-caption {
    display: none;
}
.highcharts-title {
    font-size: 1.5em !important;
}

@media screen and (max-width: 640px) {
    .dv-chart {
        background-color: white;
    }

    .highcharts-title {
        font-size: 1em !important;
    }

    .dv-chart-container {
        max-width: 100vw;
    }
}
</style>
