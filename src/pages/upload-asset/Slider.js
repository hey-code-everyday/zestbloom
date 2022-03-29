import React, { useState } from 'react';
import Slider from 'react-slick';
import Thumb from './assetImage';
import PropTypes from 'prop-types';

const SlickSlider = ({ isSeries, files }) => {
    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();

    return (
        <div className="thumbnail-slider">
            <>
                <Slider
                    asNavFor={nav2}
                    ref={(slider1) => setNav1(slider1)}
                    className="preview-mode"
                    arrows={false}
                >
                    {files?.map((file, i) => (
                        <div key={i} className="asset-preview-image">
                            <Thumb
                                file={file}
                                style={{ maxHeight: '500px', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                </Slider>

                {isSeries && files?.length > 1 && (
                    <Slider
                        asNavFor={nav1}
                        ref={(slider2) => setNav2(slider2)}
                        slidesToShow={files.length > 4 ? 4 : files.length}
                        swipeToSlide={true}
                        focusOnSelect={true}
                        arrows={false}
                        className="preview-navigation"
                    >
                        {files?.map((file, i) => (
                            <div key={i} className="asset-preview-image">
                                <Thumb
                                    file={file}
                                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                                />
                            </div>
                        ))}
                    </Slider>
                )}
            </>
        </div>
    );
};

SlickSlider.propTypes = {
    handleNext: PropTypes.func,
    classes: PropTypes.object,
    setAllValues: PropTypes.func,
    allValues: PropTypes.object,
};

export default SlickSlider;
