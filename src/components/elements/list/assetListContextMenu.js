import React from 'react';
import PropTypes from 'prop-types';

import { Box, Menu, Button } from '@material-ui/core';

const AssetListContextMenu = ({
    contextMenu,
    handleCloseContextMenu,
    selectedAssets,
    items,
    showGroupAction,
    setToPrivate,
    setToPublic,
    handleCreateGroup,
}) => {
    return (
        <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
                contextMenu !== null
                    ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                    : undefined
            }
        >
            <Box display="flex" alignItems="center" mx={1}>
                <Box
                    position="relative"
                    height={50}
                    width={50 + selectedAssets.slice(0, 3).length * 10}
                >
                    {selectedAssets.slice(0, 3).map((assetId, idx) => {
                        const item = items.find((asset) => asset.asset.asset_id === assetId);
                        const { url: iamge_url, ipfs_url } = item?.asset?.content ?? {};
                        const img = iamge_url ?? ipfs_url;
                        return (
                            <img
                                src={img}
                                alt={`selected-${assetId}`}
                                key={`selected-${assetId}`}
                                className="assetListPopImgs"
                                style={{ left: `${idx * 15}px` }}
                            />
                        );
                    })}
                    {selectedAssets.length > 3 && (
                        <span className="moreImgText" style={{ left: '35px' }}>
                            + {selectedAssets.length - 3}
                        </span>
                    )}
                </Box>
                <Box>
                    <span className="text-primary">
                        {selectedAssets.length} Asset{selectedAssets.length > 1 && 's'}
                    </span>{' '}
                    <span className="text-gray-50">Selected</span>
                </Box>
                <Box ml={1}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            handleCloseContextMenu();
                            setToPrivate();
                        }}
                    >
                        Private
                    </Button>
                </Box>
                <Box ml={1}>
                    <Button
                        variant="contained"
                        size="medium"
                        color="primary"
                        fullWidth
                        onClick={() => {
                            handleCloseContextMenu();
                            setToPublic();
                        }}
                    >
                        Public
                    </Button>
                </Box>
                {/* {showGroupAction && (
                    <Box ml={1}>
                        <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                handleCloseContextMenu();
                                handleCreateGroup();
                            }}
                        >
                            Group
                        </Button>
                    </Box>
                )} */}
            </Box>
        </Menu>
    );
};

AssetListContextMenu.propTypes = {
    contextMenu: PropTypes.any,
    handleCloseContextMenu: PropTypes.func.isRequired,
    selectedAssets: PropTypes.arrayOf(PropTypes.number).isRequired,
    items: PropTypes.array.isRequired,
    showGroupAction: PropTypes.bool.isRequired,
};

export default AssetListContextMenu;
