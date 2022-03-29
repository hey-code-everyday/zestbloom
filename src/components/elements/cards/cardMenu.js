import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { MoreVert, PublicOutlined, CollectionsOutlined } from '@material-ui/icons';
import LottieContainer from 'components/shared/LottieContainer';
import ReconfigAssetModal from 'components/elements/modal/reconfigAssetModal';

// import IconReconfig from 'assets/img/config.svg';
import ThreeDot from 'assets/img/dot-three.svg';
import IconBomb from 'assets/img/bomb.svg';

import PropTypes from 'prop-types';

const CardMenu = ({
    currentAsset,
    changeAssetVisibility,
    nodes,
    cardRef,
    canEdit,
    haveAuction = false,
    deleteLoading = false,
    canDelete = false,
    onOpenDeleteModal,
    isMiniMenu,
}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [cardMenuEl, setCardMenuEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reconfigModalVisible, setReconfigModalVisible] = useState(false);
    const [attributes, setAttributes] = useState([]);
    const [clawbackAddress, setClawbackAddress] = useState(
        currentAsset?.asset?.clawback_address ?? '',
    );
    const [freezeAddress, setFreezeAddress] = useState(currentAsset?.asset?.freeze_address ?? '');

    const nodeOfAsset = useMemo(
        () => currentAsset?.nodes?.find((node) => node?.owner?.username === user?.username),
        [currentAsset, user],
    );
    const openCardMenu = (e) => {
        setCardMenuEl(e.currentTarget);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.add('openCardMenu');
        }
    };

    const closeCardMenu = () => {
        setCardMenuEl(null);
        if (cardRef) {
            const element = cardRef.current;
            element.classList.remove('openCardMenu');
        }
    };

    const changeVisibility = () => {
        if (!loading) {
            const data = {
                visibility: nodes?.[0]?.visibility === 'public' ? 'private' : 'public',
            };
            setLoading(true);
            const change = Promise.all(
                nodes?.map(async (x) =>
                    dispatch(changeAssetVisibility(x?.guid, data, currentAsset?.guid)),
                ),
            );
            change.then((res) => {
                setLoading(false);
            });
        }
    };

    // const openReconfigModal = () => setReconfigModalVisible(true);
    const closeReconfigModal = () => setReconfigModalVisible(false);

    const onSaveConfig = () => {
        console.log('==>> saving config');
    };
    return (
        <>
            {isMiniMenu ? (
                <button onClick={openCardMenu}>
                    <img src={ThreeDot} alt="dot-icon" />
                </button>
            ) : (
                <div className="hover-bg-secondary">
                    <IconButton
                        disableRipple
                        color="secondary"
                        onClick={openCardMenu}
                        className="no-hover"
                    >
                        <MoreVert style={{ fontSize: 24 }} />
                    </IconButton>
                </div>
            )}
            <Menu
                anchorEl={cardMenuEl}
                keepMounted
                open={Boolean(cardMenuEl)}
                onClose={closeCardMenu}
                className="card-dropdown"
                getContentAnchorEl={null}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {canEdit && (
                    <MenuItem disableGutters>
                        <Link to={`/edit/${currentAsset?.asset?.asset_id}`}>
                            <CollectionsOutlined style={{ fontSize: 24 }} />
                            <span>Edit Asset</span>
                        </Link>
                    </MenuItem>
                )}
                {!canEdit && haveAuction && (
                    <MenuItem disableGutters>
                        <Link to={`/profile/${user?.username}/contracts`}>
                            <CollectionsOutlined style={{ fontSize: 24 }} />
                            <span>Check open contracts</span>
                        </Link>
                    </MenuItem>
                )}
                <MenuItem disableGutters>
                    <button onClick={changeVisibility}>
                        {loading ? (
                            <LottieContainer
                                containerStyles={{
                                    height: '24px',
                                    width: '24px',
                                }}
                                lottieStyles={{ width: '24px' }}
                            />
                        ) : (
                            <PublicOutlined fontSize="medium" />
                        )}
                        <span>
                            {nodes?.[0]?.visibility === 'public' ? 'Make Private' : 'Make Public'}
                        </span>
                    </button>
                </MenuItem>
                {/* <MenuItem disableGutters>
                    <button onClick={openReconfigModal}>
                        <img src={IconReconfig} alt="Reconfig" width={27} height={24} />
                        <span>Reconfig Asset</span>
                    </button>
                </MenuItem> */}
                {canDelete && (
                    <MenuItem disableGutters>
                        <button onClick={onOpenDeleteModal}>
                            {deleteLoading ? (
                                <LottieContainer
                                    containerStyles={{
                                        height: '24px',
                                        width: '24px',
                                    }}
                                    lottieStyles={{ width: '24px' }}
                                />
                            ) : (
                                <img src={IconBomb} alt="Destroy" width={27} height={24} />
                            )}
                            <span>Destroy</span>
                        </button>
                    </MenuItem>
                )}
            </Menu>

            <ReconfigAssetModal
                open={reconfigModalVisible}
                close={closeReconfigModal}
                defaultFrozen={false}
                assetAttributes={attributes}
                setAttributes={setAttributes}
                assetManager={nodeOfAsset?.user_type}
                clawbackAddress={clawbackAddress}
                freezeAddress={freezeAddress}
                setClawbackAddress={setClawbackAddress}
                setFreezeAddress={setFreezeAddress}
                onSave={onSaveConfig}
            />
        </>
    );
};

CardMenu.propTypes = {
    haveAuction: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    deleteLoading: PropTypes.bool,
    canDelete: PropTypes.bool,
    isMiniMenu: PropTypes.bool,
    currentAsset: PropTypes.object,
    cardRef: PropTypes.object,
    nodes: PropTypes.array,
    canEdit: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    onOpenDeleteModal: PropTypes.func,
    changeAssetVisibility: PropTypes.func,
};

export default CardMenu;
