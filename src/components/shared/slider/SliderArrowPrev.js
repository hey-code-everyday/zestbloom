import React from 'react';
import { ChevronLeft } from '@material-ui/icons';

const SlideArrowPrev = ({ currentSlide, slideCount, children, ...props }) => (
    <div {...props} className={`list-link ${props.className}`} style={{ display: 'flex' }}>
        <ChevronLeft />
    </div>
);

export default SlideArrowPrev;
