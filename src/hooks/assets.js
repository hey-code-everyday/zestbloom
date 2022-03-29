import AlgoFont from 'assets/img/algo-font.svg';
import AlgoFontWhite from 'assets/img/algo-font-white.svg';
import useWindowDimensions from 'hooks/useWindowDimensions';

export const useAlgoFont = () => {
    const { isMobile } = useWindowDimensions();
    return isMobile ? AlgoFontWhite : AlgoFont;
};
