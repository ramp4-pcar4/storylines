import JSZip from 'jszip';
import type { Options as nouiOptions } from 'nouislider';

export interface StoryRampConfig {
    title: string;
    lang: string;
    introSlide: Intro;
    slides: (Slide | {})[];
    contextLink: string;
    contextLabel: string;
    tocOrientation: string;
    breadcrumbs?: BreadcrumbConfig[];
    returnTop?: boolean;
    stylesheets?: string[];
    dateModified: string;
    lazyLoad: boolean;
    tableOfContents?: MenuItem[];
}

export interface ConfigFileStructure {
    uuid: string;
    zip: JSZip;
    configs: { [key: string]: StoryRampConfig };
    assets: {
        [key: string]: JSZip;
    };
    charts: {
        [key: string]: JSZip;
    };
    rampConfig: {
        [key: string]: JSZip;
    };
}

export interface MenuItem {
    title: string;
    slideIndex: number;
    sublist?: [
        {
            title: string;
            slideIndex: number;
        }
    ];
}

export interface DQVOptions {
    title: string;
    subtitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    width?: number;
    height?: number;
    export: boolean;
    colours?: string[];
    credits: boolean;
    type: string;
}

export interface SeriesData {
    name: string;
    y?: number;
    data?: number[];
    type?: string;
}

export interface PieSeriesData {
    name: string;
    data: PieDataRow[];
}

export interface PieDataRow {
    name: string;
    y?: number;
}

export interface LineSeriesData {
    name: string;
    data: number[];
}

export interface DQVChartConfig {
    chart: {
        type: string;
    };
    title: {
        text: string;
    };
    credits?: {
        enabled: boolean;
    };
    subtitle?: {
        text: string;
    };
    yAxis?: {
        title: {
            text: string;
        };
    };
    xAxis?: {
        title: {
            text: string;
        };
        categories: (number | string)[];
    };
    data?: {
        csvURL: string;
        enablePolling: boolean;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plotOptions?: any;
    exporting?: {
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
        enabled?: boolean;
    };
    series?: SeriesData[] | { data: SeriesData[] };
}

export interface Intro {
    logo: {
        src: string;
        altText?: string;
    };
    title: string;
    subtitle?: string;
    blurb?: string;
    backgroundImage: string;
    titleColour: string;
    subtitleColour: string;
    buttonColour: string;
}

export interface Slide {
    title: string;
    // tuple definition to restrict array size
    // panel: [BasePanel, BasePanel | undefined];
    panel: BasePanel[];
    index: number;
    backgroundImage: string | undefined;
    backgroundAltText?: string;
    includeInToc?: boolean;
    bgCssClasses?: string;
}

export enum PanelType {
    Text = 'text',
    Image = 'image',
    InteractiveImage = 'interactive-image',
    Map = 'map',
    InteractiveMap = 'interactive-map',
    Chart = 'chart',
    Video = 'video',
    Slideshow = 'slideshow',
    SlideshowImage = 'slideshowImage',
    SlideshowChart = 'slideshowChart',
    Dynamic = 'dynamic',
    Loading = 'loading'
}

export interface BasePanel {
    type: string;
    width?: number;
    customStyles?: string; // css string
    cssClasses?: string;
}

export interface TextPanel extends BasePanel {
    type: PanelType.Text;
    title: string;
    titleTag: string;
    content: string; // in md format
    textColour: string;
}

export interface MapPanel extends BasePanel {
    type: PanelType.Map;
    config: string;
    fullscreen?: boolean;
    timeSlider?: TimeSliderConfig;
    title: string;
    caption: string;
    scrollguard: boolean;
    teleportGrid?: string;
    customTemplates: string[];
}

export interface InteractiveMapPanel extends BasePanel {
    type: PanelType.InteractiveMap;
    config: string;
    title: string;
    scrollguard: boolean;
    points: PointOfInterest[];
    teleportAOI?: string;
    duration?: number;
}

export interface PointOfInterest {
    title: string;
    text: string;
    image: string;
    altText: string;
    target: PointOfInterestTarget;
    hideLayers: string[];
}

export interface PointOfInterestTarget {
    oid: number;
    layerId: string;
    returnHome?: boolean;
    layerIndex?: number;
    icon?: string;
    scale?: number;
}

export interface TimeSliderConfig {
    range: number[];
    start: number[];
    attribute: string;
    arcgisDate?: boolean;
    layers?: string[];
    animation: {
        playMode?: TimeSliderPlayMode;
        interval?: number;
    };
    sliderConfig?: nouiOptions;
    formatters: TimeSliderFormatter[];
}

export interface TimeSliderFormatter {
    mode: TimeSliderFormat;
    internal?: boolean;
    pips?: boolean;
    aria?: boolean;
    display?: boolean;
}

export interface ValueFormatter extends TimeSliderFormatter {
    mode: TimeSliderFormat.Values;
    values: string[];
}

export interface RangeFormatter extends TimeSliderFormatter {
    mode: TimeSliderFormat.Ranges;
    ranges: string[][];
    separator?: string;
}

export interface DateFormatter extends TimeSliderFormatter {
    mode: TimeSliderFormat.Date;
    format: string;
}

export enum TimeSliderFormat {
    None = 'none',
    Date = 'date',
    Ranges = 'ranges',
    Values = 'values'
}

export enum TimeSliderPlayMode {
    Append = 'append',
    Distinct = 'distinct'
}

export interface DynamicPanel extends BasePanel {
    type: PanelType.Dynamic;
    title: string;
    titleTag: string;
    content: string;
    children: DynamicChildItem[];
    textColour?: string;
    reversed?: boolean;
    hideReturn?: boolean;
    contentWidth?: string;
}

export interface DynamicChildItem {
    id: string;
    panel: BasePanel;
}

export interface InteractiveImagePanel extends BasePanel {
    type: PanelType.InteractiveImage;
    title: string;
    titleTag: string;
    zones: InteractiveImageZone[];
    panels: DynamicChildItem[];
    images: Image[];
    defaultImage: Image;
    width?: number;
    height?: number;
    class?: string;
    caption?: string;
    reversed?: boolean;
    hideReturn?: boolean;
    contentWidth?: string;
}

export interface InteractiveImageZone {
    imageId?: string;
    panelId: string;
    class?: string;
    top: string;
    left: string;
    width: string;
    height: string;
    disableHover?: boolean;
}

export interface Image {
    src: string;
    id: string;
    altText?: string;
}

export interface ImagePanel extends BasePanel {
    type: PanelType.Image;
    src: string;
    width?: number;
    height?: number;
    class?: string;
    fullscreen?: boolean;
    altText?: string;
    caption?: string;
    tooltip?: string;
}

export interface VideoPanel extends BasePanel {
    type: PanelType.Video;
    title: string;
    src: string;
    videoType: 'local' | 'external' | 'YouTube';
    thumbnailUrl?: string;
    transcript?: string;
    width?: number;
    height?: number;
    caption?: string;
    autoplay?: boolean;
}

export interface SlideshowPanel extends BasePanel {
    type: PanelType.Slideshow;
    items: Array<ChartPanel | TextPanel | ImagePanel | MapPanel>;
    loop?: boolean;
    caption?: string;
}

export interface SlideshowImagePanel extends BasePanel {
    type: PanelType.SlideshowImage;
    items: Array<ImagePanel>;
    loop?: boolean;
    caption?: string;
}

export interface SlideshowChartPanel extends BasePanel {
    type: PanelType.SlideshowChart;
    items: Array<ChartPanel>;
    loop?: boolean;
    caption?: string;
}

export interface ChartPanel extends BasePanel {
    type: PanelType.Chart;
    src: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: any;
    name?: string;
    options?: DQVOptions;
    caption?: string;
}

export interface ChartConfig {
    src: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config?: any;
    name?: string;
    options?: DQVOptions;
    caption?: string;
}

export interface BreadcrumbConfig {
    title: string;
    href: string;
}
