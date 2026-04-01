<template>    <div ref="el" class="time-slider absolute w-full h-full left-0 flex flex-col items-center bg-white">
        <button class="absolute left-4 play-button" @click="intervalID >= 0 ? endLoop() : startLoop()"
            :content="$t(intervalID >= 0 ? 'timeslider.pause' : 'timeslider.play')"
            v-tippy="{ placement: 'top', hideOnClick: false, animateFill: true }"
            :aria-label="$t(intervalID >= 0 ? 'timeslider.pause' : 'timeslider.play')">
            <svg v-if="intervalID === -1" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"
                width="24px" fill="#595959">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                fill="#595959">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
        </button>
        <span class="my-2.5 text-base range-display"><span class="">{{ displayFormat ? (displayFormat as
            any).to(parseInt(range[0]), 0) : range[0] }}</span><span class="" v-if="range[1]"> - {{ displayFormat ?
                    (displayFormat as any).to(parseInt(range[1]), 1) : range[1] }}</span></span>
        <button class="absolute right-4 minimize-button" @click="minimizeToggle()"
            :content="$t(minimized ? 'timeslider.expand' : 'timeslider.minimize')"
            v-tippy="{ placement: 'top', hideOnClick: false, animateFill: true }"
            :aria-label="$t(minimized ? 'timeslider.expand' : 'timeslider.minimize')">
            <svg v-if="!minimized" xmlns="http://www.w3.org/2000/svg" viewBox="6 6 36 36" height="24" width="24"
                fill="#595959">
                <path d="m24 30.75-12-12 2.15-2.15L24 26.5l9.85-9.85L36 18.8Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="6 6 36 36" fill="#595959">
                <path d="M14.15 30.75 12 28.6l12-12 12 11.95-2.15 2.15L24 20.85Z" />
            </svg>
        </button>
        <div class="time-slider-backdrop"></div>
        <div v-show="!minimized" ref="sliderTarget" class="noUi-target noUiSlider"></div>
    </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref } from 'vue';
import { TimeSliderFormat, TimeSliderPlayMode } from '@storylines/definitions';
import type { DateFormatter, RangeFormatter, TimeSliderConfig, TimeSliderFormatter, ValueFormatter } from '@storylines/definitions';
import noUiSlider, { type API, type Formatter, type Options, PipsMode } from 'nouislider';
import { useI18n } from 'vue-i18n';
import { debounce } from 'es-toolkit/function';

const { t } = useI18n();

const props = defineProps({
    config: {
        type: Object as PropType<TimeSliderConfig>,
        required: true
    },
    rInstance: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: Object as PropType<any>
    }
});

const minimized = ref(false);
const el = ref();
const sliderTarget = ref();
const sliderElement = ref<HTMLElement>();
const slider = ref<API>();
const range = ref<string[]>(['', '']);
const intervalID = ref(-1);

const displayFormat = ref<Formatter | undefined>();
let internalFormat: Formatter | undefined;
let pipsFormat: Formatter | undefined;

onMounted(() => {
    if (props.config.formatters) {
        if (!Array.isArray(props.config.formatters)) {
            setUpFormatters([props.config.formatters]);
        } else {
            setUpFormatters(props.config.formatters);
        }
    }

    const sliderConfig: Options = {
        start: props.config.start,
        range: {
            min: props.config.range[0],
            max: props.config.range[1]
        },
        connect: true,
        step: 1,
        format: internalFormat,
        ariaFormat: pipsFormat,
        pips: {
            mode: PipsMode.Steps,
            density: 100,
            filter: (val: number) => {
                return 1
            }
        },
        ...props.config.sliderConfig
    };

    sliderConfig.pips!.format = pipsFormat;

    sliderElement.value = sliderTarget.value as HTMLElement;
    slider.value = noUiSlider.create(sliderElement.value, sliderConfig);

    slider.value.on('update', sliderUpdateHandler);

    // to have an element focusable inside the RAMP container, its tabindex must not be 0;
    // tabindex 0 is controlled by the browser; RAMP focus manager will ignore such elements and not set focus to them;
    const sliderHandles = sliderElement.value.querySelectorAll('.noUi-handle');
    sliderHandles.forEach((handle: Element) => {
        handle.setAttribute('tabindex', '-2');
    });

    // run the slider update handler once all layers are loaded
    props.rInstance.event.on(
            'layer/layerstatechange',
            () => {
                if (props.rInstance.geo.layer.allLayers().every((l: any) => l.isLoaded)) {
                    sliderUpdateHandler();
                }
            }
    );
});

const sliderUpdateHandler = debounce( () => {
        const sliderValues = slider.value!.get() as string | string[];
        if (Array.isArray(sliderValues)) {
            range.value = sliderValues.map((n: string) => {
                return n.split('.')[0];
            });
        } else {
            range.value = [sliderValues.split('.')[0]];
        }

        let sqlString: string;

        switch (range.value.length) {
            case 1:
                if (props.config.arcgisDate) {
                    sqlString = `${props.config.attribute} = ${makeArcGISDateQuery(range.value[0])}`;
                } else {
                    sqlString = `${props.config.attribute} = ${range.value[0]}`;
                }
                break;

            default:
                if (props.config.arcgisDate) {
                    sqlString = `${props.config.attribute} >= ${makeArcGISDateQuery(range.value[0])} AND ${props.config.attribute} <= ${makeArcGISDateQuery(range.value[1])}`;    
                } else {
                    sqlString = `${props.config.attribute} >= ${range.value[0]} AND ${props.config.attribute} <= ${range.value[1]}`;
                }
                break;
        }

        if (!props.config.layers || props.config.layers.length === 0) {
            props.rInstance.geo.layer
                .allLayers()
                .filter((l: any) => l.supportsFeatures && !l.isCosmetic)
                .forEach((l: any) => {
                    l.setSqlFilter('time_slider', sqlString);
                });
        } else {
            props.config.layers.forEach((layerId) => {
                const l = props.rInstance.geo.layer.getLayer(layerId);
                l?.setSqlFilter('time_slider', sqlString);
            });
        }
    }, 250);

/**
 * Turn a timeslider value into the proper format for querying an arcgis date attribute
 * 
 * @param epochTime epoch time for a date
 */
const makeArcGISDateQuery = (epochTime: string) => {
    const d = new Date(parseInt(epochTime));

    return `timestamp '${d.getUTCFullYear()}-${d.getUTCMonth().toString().padStart(2,'0')}-${d.getUTCDay().toString().padStart(2,'0')} ${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}:${d.getUTCSeconds().toString().padStart(2, '0')}'` 
}

/**
 * Begins looping through the values on the time slider
 */
const startLoop = () => {
    const sliderValues = slider.value!.get(true) as number | number[];
    if (Array.isArray(sliderValues)) {
        slider.value!.set(sliderValues.map(() => sliderValues[0]));
    }
    // delay happens before first call
    intervalID.value = window.setInterval(moveHandle, props.config.animation?.interval || 1400);
};

/**
 * Moves handle(s) according to the play mode specified in the config. Default behaviour is to move all handles to the right one position.
 */
const moveHandle = () => {
    const sliderValues = slider.value!.get(true) as number | number[];
    let newValues;
    if (Array.isArray(sliderValues)) {
        const nextMove = slider.value!.steps()[sliderValues.length - 1][1]
        switch (props.config.animation?.playMode) {
            case TimeSliderPlayMode.Append:
                // move only rightmost handle to the right
                //@ts-ignore -- compiler lib value says `with` is not a function for arrays, can remove if lib target updated
                newValues = sliderValues.with(
                    sliderValues.length - 1,
                    nextMove ? sliderValues[sliderValues.length - 1] + nextMove : props.config.range[0]);
                break;
            case TimeSliderPlayMode.Distinct:
            default:
                // move all handles one position to the right
                newValues = sliderValues.map(() => {
                    return nextMove ? sliderValues[sliderValues.length - 1] + nextMove : props.config.range[0];
                });
                break;
        }
    } else {
        newValues = [sliderValues === props.config.range[1] ? props.config.range[0] : sliderValues + 1];
    }
    slider.value!.set(newValues);
};

/**
 * Cancels looping through the values on the time slider
 */
const endLoop = () => {
    clearInterval(intervalID.value);
    // reset so template knows we aren't looping
    intervalID.value = -1;
};

const minimizeToggle = () => {
    minimized.value = !minimized.value;
    if (minimized.value) {
        (el.value.parentElement as HTMLElement).classList.add('minimized');
    } else {
        (el.value.parentElement as HTMLElement).classList.remove('minimized');
    }
};

const setUpFormatters = (formatters: TimeSliderFormatter[]) => {
    // Display format
    displayFormat.value = createFormat(formatters.find(formatter => formatter.display === true)
        || formatters.find(formatter => formatter.display === undefined));
    // Internal format
    internalFormat = createFormat(formatters.find(formatter => formatter.internal === true));
    // Pip format
    pipsFormat = createFormat(formatters.find(formatter => formatter.pips === true)
        || formatters.find(formatter => formatter.pips === undefined));
}

const createFormat = (formatter: TimeSliderFormatter | undefined): Formatter | undefined => {
    if (formatter === undefined) {
        return undefined;
    }

    switch (formatter.mode) {
        case TimeSliderFormat.Values:
            const valueFormatter = formatter as ValueFormatter;
            return {
                to: (val: number, index?: number) => {
                    if (isNaN(val)) { return ''}

                    return valueFormatter.values[val - 1];
                },
                from: (val: string) => {
                    return valueFormatter.values.indexOf(val);
                }
            }

        case TimeSliderFormat.Ranges:
            const rangeFormatter = formatter as RangeFormatter;
            return {
                to: (val: number, index?: number) => {
                    if (isNaN(val)) { return ''}
                    
                    if (index !== undefined) {
                        return rangeFormatter.ranges[val - 1][index]
                    } else {
                        return rangeFormatter.ranges[val - 1].join(rangeFormatter.separator || '-');
                    }
                },
                from: (val: string) => {
                    return rangeFormatter.ranges.indexOf(val.split(rangeFormatter.separator || '-'));
                }
            }

        case TimeSliderFormat.Date:
            const dateFormatter = formatter as DateFormatter;
            return {
                to: (val: number, index?: number) => {
                    if (isNaN(val)) { return ''}

                    const date = new Date(val);

                    const months = [
                        'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
                    ]

                    const funcMaps = {
                        "(Y+)": date.getFullYear(),
                        "(D+)": date.getDate(),
                        "(h+)": date.getHours(),
                        "(m+)": date.getMinutes(),
                        "(s+)": date.getSeconds()
                    }


                    let format = dateFormatter.format;
                    Object.entries(funcMaps).forEach(([key, func]) => {
                        format = format.replace(new RegExp(key, 'g'), (match) => {
                            return func.toString().padStart(2, '0').slice(-1 * match.length);
                        });
                    });

                    // checking for month separately so we can have numerical or the full name
                    format = format.replace(new RegExp('(M+)'), (match) => {
                        if (match.length === 1) {
                            return (date.getUTCMonth() + 1).toString().padStart(2,'0');
                        } else {
                            return t(`month.${months[date.getUTCMonth()]}`)
                        }
                    });

                    return format;
                },
                from: (val: string) => {
                    return Date.parse(val);
                }
            }
        default:
            return undefined;
    }
}
</script>

<style lang="scss">
.time-slider {
    @import './../../../../../node_modules/nouislider/dist/nouislider';

    pointer-events: all;

    .noUi-target {
        @apply w-4/5;
    }

    .noUi-value {
        color: #555;
    }

    .play-button,
    .minimize-button {
        top: 4px;
    }

    // MEDIA QUERY
    @media screen and (max-width: 640px) {
        .noUi-value:nth-of-type(4n) {
            display: none;
        }

        .range-display {
            @apply m-0;
        }

        .noUi-marker-large {
            height: 9px !important;
        }

        .play-button {
            @apply left-2 top-0;
        }

        .minimize-button {
            @apply right-2 top-0;
        }
    }

    // hide the slider rail
    .noUi-connect {
        background: var(--sr-accent-colour);
    }

    .noUi-base {
        @apply cursor-pointer;
    }

    // hide most of the slider handle leaving a bottom border only
    .noUi-origin {
        .noUi-handle {

            &::before,
            &::after {
                content: none !important;
            }

            @apply w-7 right-0 transform translate-x-1/2 cursor-pointer;

            border-radius: 50%;
            border-color: #595959;
        }
    }
}
</style>
