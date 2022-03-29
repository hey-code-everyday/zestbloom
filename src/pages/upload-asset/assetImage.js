import React, { useState, useEffect } from 'react';
import LottieContainer from 'components/shared/LottieContainer';
import PropTypes from 'prop-types';

const Thumb = ({ file, style = {}, className = '' }) => {
    const [data, setData] = useState({
        type: '',
        loading: false,
        thumb: undefined,
    });

    useEffect(() => {
        if (!file) return;
        setData((prev) => ({ ...prev, loading: true }));
        const reader = new FileReader();
        reader.onloadend = () => {
            setData({ loading: false, thumb: reader.result, type: file.type });
        };

        reader.readAsDataURL(file);
    }, [file]);

    if (!file) return null;

    const getDataOfFile = (data) => {
        const type = data.type.split('/')[0];
        switch (type) {
            case 'image':
                return <img src={data.thumb} style={style} alt={file.name} />;
            case 'audio':
                return (
                    <audio controls>
                        <source src={data.thumb} type={data.type} />
                    </audio>
                );
            case 'video':
                return (
                    <video width={260} height={200} controls>
                        <source src={data.thumb} type={data.type} />
                    </video>
                );
            case 'text':
            case 'application':
                return (
                    <iframe
                        src={data.thumb}
                        type={data.type}
                        title="asset-image"
                        sandbox=""
                    ></iframe>
                );
            default:
                return <img src={data.thumb} style={style} alt={file.name} />;
        }
    };

    return (
        <>
            {data.loading ? (
                <LottieContainer
                    containerStyles={{
                        height: '46px',
                        width: '100%',
                    }}
                    lottieStyles={{ width: '46px' }}
                />
            ) : (
                getDataOfFile(data)
            )}
        </>
    );
};

Thumb.propTypes = {
    file: PropTypes.object,
    style: PropTypes.object,
    className: PropTypes.string,
};

export default Thumb;
