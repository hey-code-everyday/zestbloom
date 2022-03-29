import React, { useEffect, useState } from 'react';
import SlickSlider from 'react-slick';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import SlideArrowNext from './SliderArrowNext';
import SlideArrowPrev from './SliderArrowPrev';
import { Box } from '@material-ui/core';

const Slider = ({ children, beforeChange, options, applyOpacity, showDots }) => {
    const id = uuid();
    const [activeIndex, setActiveIndex] = useState(0);
    const handleBeforeChange = (_oldIndex, newIndex) => {
        setActiveIndex(newIndex);
        beforeChange();
    };

    useEffect(() => {
        if (applyOpacity) {
            const activeCount = document
                .getElementById(id)
                .querySelectorAll('.slick-active').length;
            const activeIndex = Math.ceil(activeCount / 2);
            document
                .getElementById(id)
                .querySelectorAll('.slick-active')
                .forEach((el, index) => {
                    el.style.setProperty('opacity', 1 - Math.abs(activeIndex - index - 1) * 0.2);
                });
        }
    }, [activeIndex, applyOpacity, id]);

    return (
        <div id={id}>
            <SlickSlider
                swipeToSlide
                focusOnSelect
                infinite={false}
                responsive={[
                    {
                        breakpoint: 2560,
                        settings: {
                            slidesToShow: 5,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 1440,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        },
                    },
                ]}
                {...options}
                nextArrow={<SlideArrowNext />}
                prevArrow={<SlideArrowPrev />}
                beforeChange={handleBeforeChange}
            >
                {children}
            </SlickSlider>
            {showDots && (
                <Box
                    width="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={10}
                >
                    {children.map((item, index) => (
                        <div
                            key={index}
                            className={`${
                                index === activeIndex ? 'slider-dot-active' : ''
                            }  slider-dot`}
                        />
                    ))}
                </Box>
            )}
        </div>
    );
};

Slider.defaultProps = {
    children: [],
    beforeChange: () => {},
    options: {},
    applyOpacity: false,
    showDots: false,
};

Slider.propTypes = {
    children: PropTypes.array,
    beforeChange: PropTypes.func,
    options: PropTypes.object,
    applyOpacity: PropTypes.bool,
    showDots: PropTypes.bool,
};

export default Slider;
