import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { Box, Card, CardMedia } from '@material-ui/core';
import { Tag } from '../../shared';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const PostCard = ({ tag, img }) => {
    // const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {
        // setChecked(event.target.checked);
    };

    return (
        <Card className="h-100 post-auction-card">
            <FormControlLabel
                control={
                    <Box
                        border={1}
                        borderColor="text.black20"
                        borderRadius={10}
                        bgcolor="text.white"
                        overflow="hidden"
                        height={40}
                        width={40}
                        className="card-top-action"
                    >
                        <Checkbox onChange={handleChange} color="primary" />
                    </Box>
                }
                label={
                    <Box p={1.5} className="card-img-wrap">
                        {tag && <Tag text={tag} className="secondary sm top-left rotated" />}
                        <div className="card-img">
                            <CardMedia image={img} style={{ height: 165 }} className="card-image" />
                        </div>
                    </Box>
                }
            />
        </Card>
    );
};

export default PostCard;
