import React from 'react';
import { ChevronRight } from '@material-ui/icons';

const SlideArrowNext = ({ currentSlide, slideCount, children, ...props }) => (
    <div {...props} className={`list-link ${props.className}`} style={{ display: 'flex' }}>
        <ChevronRight />
    </div>
);

export default SlideArrowNext;
