import NftImage from '../assets/img/img-nft.svg';
import LogoZestBloom from '../assets/img/img-ZestBloom.svg';
import AlgoImage from '../assets/img/img-algorand.svg';

const titles = [
    {
        label: 'General Questions',
        index: 0,
        configName: 'generalQuestion',
    },
    {
        label: 'ZestBloom Features',
        index: 1,
        configName: 'zestBloomFeatures',
    },
    {
        label: 'Manage Your Account',
        index: 2,
        configName: 'manageYourAccount',
    },
    {
        label: 'Policies',
        index: 3,
        configName: 'policies',
    },
    {
        label: 'Privacy, Safety, Security',
        index: 4,
        configName: 'privacySafetySecurity',
    },
];

const generalQuestion = [
    {
        title: 'What is ZestBloom?',
        infos: [
            {
                description: `ZestBloom is a next generation Digital Media marketplace seeking to
        offer a brand new way of experiencing Crypto Art while
        simultaneously supporting and promoting artists for their
        contributions. We are built on the Algorand blockchain`,
            },
        ],
        img: LogoZestBloom,
    },
    {
        title: 'What is Algorand?',
        infos: [
            {
                description: `Algorand is one of the fastest and most efficient blockchains to
        date. It facilitates secure transactions and tracking ownership of
        assets with lower fees and a smaller carbon footprint.`,
            },
        ],
        img: AlgoImage,
    },
    {
        title: 'What are NFTs?',
        infos: [
            {
                description: `Non-fungible tokens (NFTs) are a way of uniquely labeling digital
        assets so that they can be recorded on the blockchain. Once on the
        blockchain, the owner of an NFT can have complete control over how
        it is used, shared, and reproduced.`,
            },
        ],
        img: NftImage,
    },
];

const zestBloomFeatures = [
    {
        title: 'How do I use it?',
        infos: [
            {
                description: `ZestBloom directly connects Creators and Collectors through auctions. Creators
        maintain ownership of their work and can confer usage rights via purchase at an
        auction.`,
                extraInfo: null,
            },
            {
                description: `The profile page allows Creators to show off their work and Collectors to share
        and organize their collection. You can also customize your profile, view your
        activity, and access user settings in the sidebar`,
                extraInfo: null,
            },
            {
                description: `Collaborations allow multiple creators to work together and choose how
        ownership is distributed among them.`,
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'Why should I use ZestBloom over other minting services?',
        infos: [
            {
                description: `ZestBloom is the only service that grants users full control over their creative
            works. Using proprietary software, we automatically prevent content misuse and
            can also help advertise`,
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'Explore',
        infos: [
            {
                description: 'How does ZestBloom recommend content?',
                extraInfo: [
                    `Users can search for keywords and topics of interests, as well as filter by
           tag, type, or artist.`,
                ],
            },
            {
                description: 'How do I remove recommended content from my page?',
                extraInfo: [
                    `You can access content recommendation controls by clicking on the
                settings under the profile page.`,
                ],
            },
        ],
        img: null,
    },
    {
        title: 'Minting',
        infos: [
            {
                description: 'How do I tag my content',
                extraInfo: [
                    'During the minting process you will be given the opportunity to pick two tags at most: a custom tag and preset tag.',
                ],
            },
            {
                description: 'How to create custom tags?',
                extraInfo: [
                    'First title your blank tag then press enter/return key, finally select tag to use in current artwork.',
                ],
            },
            {
                description: 'What is Unit Name?',
                extraInfo: [
                    `Short name for the asset (limit 8 characters). Define asset type, a description of sub-type of the  asset and a defining characteristic Ex: “Dg-PomS1”
                   `,
                ],
            },
            {
                description: 'How do I submit content?',
                extraInfo: [
                    'Navigate to the profile page. Click the blue “Create” button on the top left-most tile near the profile sidebar. There you can upload your work and mint your NFT. ',
                ],
            },
            {
                description: 'What is the marketplace’s commission?',
                extraInfo: [
                    'Creators receive the full, displayed price of the asset. For example, after an auction the Creator will receive the value displayed as the final bid price. ',
                    'Collectors pay a 8% commission fee on primary sales (directly from the Creator).',
                    'Collectors pay 4% commission on secondary sales plus an additional royalty commission decided by and paid to the Creator.',
                ],
            },
            {
                description: 'Suggested royalty amounts',
                extraInfo: [
                    'Royalties may be set between 0% - 20% only by the original creator',
                    'We suggest you keep your royalty between 1% - 5% when you’re first developing your artwork.',
                    'If your work is well established, we recommend a royalty between 5% - 10%.',
                    'If your work is well established and the piece is highly sought after we recommend you increase your royalty between 10% - 20%.',
                ],
            },
            {
                description: 'File sizes?',
                extraInfo: [
                    'Upload files max out at  50 MB - ZestBloom is working hard to incorporate arweave a permanent file system enables you to keep your artwork on the blockchain forever. Once implemented ZestBloom will allow you to increase your file size.',
                ],
            },
            {
                description: 'Edit Mint:',
                extraInfo: [
                    'When editing, you can change the requested royalty payout but it will only be applied to new sales via escrow, for non-clawback, non-frozen NFTs.',
                    'For Managed Assets, the rules of the sales using clawback mechanism are permanently inscribed into their smart contracts.',
                    'Only assets that are not frozen can be listed back for auction after purchase even if you are the secondary owner and purchased the NFT at a set price.',
                ],
            },
        ],
        img: null,
    },
    {
        title: 'Managed account options:',
        infos: [
            {
                description: 'What is Creator Managed?',
                extraInfo: [
                    `Creator takes responsibility for the asset: If the creator takes control of the asset they can change clawback address and pull back the asset from the purchaser. Maintenance on smart contracts falls on the creator and takes full ownership of maintaining the asset.
                `,
                ],
            },
            {
                description: 'ZestBloom Managed?',
                extraInfo: [
                    `ZestBloom takes control of the asset: ZestBloom can maintain or update the managed contracts between users. Acts as a neutral party between parties. 
                `,
                ],
            },
            {
                description: 'Unmanaged?',
                extraInfo: [
                    'No one manages the asset: Nothing can be changed - this contract can’t be updated or maintained by any user but lives on the blockchain forever.',
                ],
            },
        ],
        img: null,
    },
    {
        title: 'How do auctions work on ZestBloom?',
        infos: [
            {
                description: 'Selling: TBD',
                extraInfo: null,
            },
            {
                description: 'Buying: TBD',
                extraInfo: null,
            },
            {
                description: 'Cancelling: TBD',
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'How do I collaborate with another artist?',
        infos: [
            {
                description: `Our goal will be to implement a chat system that will allow for collaboration in the
            next Quarter.`,
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'How do series work?',
        infos: [
            {
                description: 'Creating: TBD',
                extraInfo: null,
            },
            {
                description: 'Changing: TBD',
                extraInfo: null,
            },
            {
                description: 'Buying: TBD',
                extraInfo: null,
            },
        ],
        img: null,
    },
];

const manageYourAccount = [
    {
        title: 'How do I sign up?',
        infos: [
            {
                description:
                    'Click the “Sign in/Sign up” button in the top right corner of the page.',
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'How do I delete my account?',
        infos: [
            {
                description: (
                    <span>
                        Please contact us at{' '}
                        <a href="https://www.zestbloom.io/" target="_blanck">
                            team@zestbloom.com
                        </a>{' '}
                        if you need to remove your account.
                    </span>
                ),
                extraInfo: null,
            },
        ],
        img: null,
    },
];

const policies = [
    {
        title: (
            <a
                href="https://drive.google.com/file/d/1DSG1jLpNq61B5XS0jsRgFsocPoloq26R/view"
                target="_blanck"
            >
                Terms of Use
            </a>
        ),
        infos: null,
        img: null,
    },
    {
        title: 'What are the Community Guidelines?',
        infos: [
            {
                description: `ZestBloom is a public space that works hard to maintain an inclusive, welcoming,
            and safe community for everyone. The Community Guidelines are general rules,
            recommendations, and values to help foster the best community possible for all
            users.`,
                extraInfo: null,
            },
        ],
        img: null,
    },
    {
        title: 'How do I report content that violates Community Guidelines?',
        infos: [
            {
                description: 'Please contact us at report@zestbloom.com or.',
                extraInfo: null,
            },
            {
                description: `Navigate to the bottom of the website, under the “My Profile” section of the footer.
                Click the last link, which says “Report Content”.`,
                extraInfo: null,
            },
        ],
        img: null,
    },
];

const privacySafetySecurity = [
    {
        title: 'Login and Passwords',
        infos: [
            {
                description: 'How can I reset my login information?',
                extraInfo: [
                    `On the Homepage on your right hand side click your profile icon to access the
                profile settings. Once you arrive, scroll down to the bottom of the page to change
                your password or email.`,
                ],
            },
        ],
        img: null,
    },
    {
        title: 'Key Management',
        infos: [
            {
                description: 'What are public and private keys?',
                extraInfo: [
                    `Public keys can be shared because they can only be used to encrypt
                data.`,
                    `Private keys should never be shared with anyone, and should be stored
                safely and securely. Private keys can be used to encrypt and decrypt
                data, i.e. full access and control over the money in that wallet.`,
                ],
            },
            {
                description: 'Where should I store my keys?',
                extraInfo: [
                    `Using a hardware wallet – sometimes called “cold storage” – is widely
                accepted as the most secure method for storing cryptocurrency. It's backed by
                security experts and keeps your private keys offline – so your crypto is
                inaccessible to anyone but the holder of specific access codes.`,
                ],
            },
        ],
        img: null,
    },
];

export const FAQ_CONFIG = {
    titles,
    generalQuestion,
    zestBloomFeatures,
    manageYourAccount,
    policies,
    privacySafetySecurity,
};
