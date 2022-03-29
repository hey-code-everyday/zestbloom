import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import moment from 'moment';

import {
    Box,
    Checkbox,
    FormControlLabel,
    Tooltip,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Fade,
} from '@material-ui/core';

import LottieContainer from 'components/shared/LottieContainer';
import OpenPicturePopover from '../cards/fullScreen';
import CardMenu from '../cards/cardMenu';
import { stopEvent } from 'helpers/functions';
import SortArrowDown from 'assets/img/sort-icon-down.svg';
import SortArrowUp from 'assets/img/sort-icon-up.svg';
import AssetOverview from './assetOverview';
import AssetListContextMenu from './assetListContextMenu';

const headers = [
    {
        label: 'Unit Name',
        field: 'unit_name',
        sortable: true,
        width: 6,
    },
    {
        label: 'Wallet',
        field: 'wallet',
        sortable: true,
        width: 3,
    },
    {
        label: 'Date',
        field: 'created_at',
        sortable: true,
        width: 3,
    },
    {
        label: 'Balance',
        field: 'balance',
        sortable: true,
        width: 3,
    },
    {
        label: 'Privacy',
        field: 'visibility',
        sortable: true,
        width: 3,
    },
    {
        label: 'Action',
        field: 'action',
        sortable: false,
        width: 3,
    },
];

const AssetList = ({
    items,
    changeAssetVisibility,
    selectedAssets = [],
    hasMore = false,
    sort = { field: 'created_at', direction: 'desc' },
    onSortChange = () => {},
    selectAsset = () => {},
    loadMore = () => {},
    showGroupAction = false,
    setToPrivate = () => {},
    setToPublic = () => {},
    handleCreateGroup = () => {},
    loading,
    loadMoreLoading,
    isMyProfile,
    callingAssetAction,
}) => {
    const tableHeaders = isMyProfile ? headers : headers.filter((h) => h.field !== 'action');
    const history = useHistory();
    const { user } = useSelector((state) => state.auth);
    const [fullScreenPhoto, setFullScreenPhoto] = useState({
        isOpen: false,
        src: '',
        content_type: '',
    });
    const [contextMenu, setContextMenu] = useState(null);
    const cardRef = useRef(null);

    const toFullScreen = (e, img, content_type) => {
        stopEvent(e);
        setFullScreenPhoto({ isOpen: true, src: img, content_type });
    };

    const formatWalletAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    const handleSelection = (e, checked, assetId) => {
        if (isMyProfile) {
            e.stopPropagation();
            e.preventDefault();
            if (e.shiftKey) {
                const indexA = items.findIndex((i) => i?.asset?.asset_id === assetId);
                const indexB = items.findIndex(
                    (i) => i?.asset?.asset_id === selectedAssets.slice(-1)[0],
                );
                const selectedIds = [];
                items.forEach((i, index) => {
                    if (index <= Math.max(indexA, indexB) && index >= Math.min(indexA, indexB)) {
                        selectedIds.push(i?.asset?.asset_id);
                    }
                });
                selectAsset(true, selectedIds);
            } else {
                selectAsset(!checked, [assetId]);
            }
        }
    };

    const handleSelectAll = (checked) => {
        selectAsset(
            checked,
            items.map((item) => item?.asset?.asset_id).filter((id) => id),
        );
    };

    const handleContextMenu = (e, onSelectedAsset) => {
        if (isMyProfile && onSelectedAsset) {
            e.preventDefault();
            setContextMenu(
                contextMenu === null
                    ? {
                          mouseX: e.clientX - 2,
                          mouseY: e.clientY - 4,
                      }
                    : null,
            );
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu(null);
    };

    const handleSortChange = (head) => {
        if (head.sortable) {
            if (sort.field === head.field) {
                onSortChange({
                    field: sort.field,
                    direction: sort.direction === 'asc' ? 'desc' : 'asc',
                });
            } else {
                onSortChange({ field: head.field, direction: 'asc' });
            }
        }
    };

    const uniqAssetIds = Array.from(new Set(items.map((i) => i?.asset?.asset_id)));

    return (
        <>
            <TableContainer component={Box} position="relative" ref={cardRef} minWidth="800px">
                {callingAssetAction && (
                    <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <LottieContainer
                            containerStyles={{
                                height: '49px',
                                width: '100%',
                                marginTop: '0px',
                            }}
                            lottieStyles={{ width: '50px' }}
                        />
                    </Box>
                )}
                <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="asset table"
                    className="asset-table"
                >
                    <TableHead>
                        <TableRow>
                            {isMyProfile && (
                                <TableCell
                                    align="left"
                                    style={{
                                        width: '20px',
                                        padding: '0 0 0 1rem',
                                        minWidth: '20px',
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                disableRipple
                                                checked={
                                                    items.length > 0 &&
                                                    selectedAssets.length === uniqAssetIds.length
                                                }
                                                onClick={() =>
                                                    handleSelectAll(
                                                        selectedAssets.length !==
                                                            uniqAssetIds.length,
                                                    )
                                                }
                                                color="primary"
                                                disabled={items.length === 0}
                                            />
                                        }
                                        style={{ fontWeight: 'bold' }}
                                    />
                                </TableCell>
                            )}
                            {tableHeaders.map((head, idx) => (
                                <TableCell
                                    align="left"
                                    onClick={() => handleSortChange(head)}
                                    key={head.field + idx}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="left"
                                        className="cursor-pointer"
                                    >
                                        {head.label}
                                        {head.field === sort.field ? (
                                            sort.direction === 'asc' ? (
                                                <Fade in={true}>
                                                    <img src={SortArrowUp} alt="arrow-up" />
                                                </Fade>
                                            ) : (
                                                <Fade in={true}>
                                                    <img src={SortArrowDown} alt="arrow-down" />
                                                </Fade>
                                            )
                                        ) : null}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Box
                                        width="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgcolor="rgba(#000,0.07)"
                                        my={1}
                                    >
                                        <LottieContainer
                                            containerStyles={{
                                                height: '49px',
                                                width: '100%',
                                                marginTop: '0px',
                                            }}
                                            lottieStyles={{ width: '50px' }}
                                        />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <Box
                                        m={2}
                                        fontWeight="bold"
                                        fontSize={20}
                                        textAlign="center"
                                        color="text.black50"
                                    >
                                        {!loading && 'No Assets'}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                        {items.map((item, idx) => {
                            const {
                                url: iamge_url,
                                ipfs_url,
                                mimetype,
                            } = item?.asset?.content ?? {};
                            const img = iamge_url ?? ipfs_url;
                            const content_type = mimetype;
                            const thumbnail = item?.asset?.thumbnail?.url;
                            const assetId = item?.asset?.asset_id;
                            const currentUserHaveAsset = item.nodes?.find(
                                (node) => user && node?.owner?.username === user?.username,
                            );
                            return (
                                <TableRow
                                    key={`${assetId}-${idx}`}
                                    onContextMenu={(e) =>
                                        handleContextMenu(e, selectedAssets.includes(assetId))
                                    }
                                    onClick={(e) =>
                                        handleSelection(
                                            e,
                                            selectedAssets.includes(assetId),
                                            assetId,
                                        )
                                    }
                                >
                                    {isMyProfile && (
                                        <TableCell
                                            style={{
                                                width: '20px',
                                                padding: '0 0 0 1rem',
                                                minWidth: '20px',
                                            }}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        disableRipple
                                                        checked={selectedAssets.includes(assetId)}
                                                        onClick={(e) =>
                                                            handleSelection(
                                                                e,
                                                                selectedAssets.includes(assetId),
                                                                assetId,
                                                            )
                                                        }
                                                        color="primary"
                                                    />
                                                }
                                                style={{ fontWeight: 'bold' }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Box
                                            onClick={() => history.push(`/asset/${assetId}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <AssetOverview
                                                content_type={content_type || ''}
                                                img={img || ''}
                                                thumbnail={thumbnail || ''}
                                                title={item?.asset?.title || ''}
                                                total={item?.asset?.total || 0}
                                                toFullScreen={toFullScreen}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title={item?.holder || ''}
                                            enterDelay={100}
                                            leaveDelay={200}
                                        >
                                            <span>{formatWalletAddress(item?.holder)}</span>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        {moment(item?.created_at).format('YYYY-MM-DD HH:mm')}
                                    </TableCell>
                                    <TableCell>{item?.amount}</TableCell>
                                    <TableCell style={{ textTransform: 'capitalize' }}>
                                        {/* <Chip label={item?.visibility} color="primary" /> */}
                                        {item?.visibility}
                                    </TableCell>
                                    {isMyProfile && (
                                        <TableCell>
                                            <Box
                                                onClick={stopEvent}
                                                display="flex"
                                                justifyContent="center"
                                            >
                                                <CardMenu
                                                    currentAsset={item}
                                                    changeAssetVisibility={changeAssetVisibility}
                                                    node={currentUserHaveAsset}
                                                    cardRef={cardRef}
                                                    canEdit={true}
                                                    isMiniMenu
                                                />
                                            </Box>
                                        </TableCell>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {hasMore && (
                <Box textAlign="center" mt={5}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="large"
                        onClick={loadMore}
                        disabled={loadMoreLoading}
                    >
                        {loadMoreLoading ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '30px',
                                    width: '32px',
                                    marginTop: '0px',
                                }}
                                lottieStyles={{ width: '32px' }}
                            />
                        ) : (
                            'Load More'
                        )}
                    </Button>
                </Box>
            )}
            {isMyProfile && (
                <AssetListContextMenu
                    contextMenu={contextMenu}
                    handleCloseContextMenu={handleCloseContextMenu}
                    selectedAssets={selectedAssets}
                    items={items}
                    showGroupAction={showGroupAction}
                    setToPrivate={setToPrivate}
                    setToPublic={setToPublic}
                    handleCreateGroup={handleCreateGroup}
                />
            )}
            {fullScreenPhoto.isOpen && (
                <OpenPicturePopover
                    fullScreenPhoto={fullScreenPhoto}
                    onClose={() => {
                        setFullScreenPhoto({ isOpen: false, src: '' });
                    }}
                    content_type={fullScreenPhoto.content_type}
                />
            )}
        </>
    );
};

export default AssetList;
