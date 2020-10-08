import React, { PropsWithChildren } from 'react';
import { mapResponsive } from '@chakra-ui/utils';
import {
  chakra,
  PropsOf,
  ResponsiveValue,
  forwardRef,
} from '@chakra-ui/system';

interface AspectRatioOptions {
  /**
   * The aspect ratio of the Box. Common values are:
   *
   * `21/9`, `16/9`, `9/16`, `4/3`, `1.85/1`
   */
  ratio?: ResponsiveValue<number>;
}

const { div: ChakraDiv } = chakra;

type AspectRatioResponsiveProps = AspectRatioOptions &
  PropsOf<typeof ChakraDiv>;

const AspectRatioResponsive = forwardRef<AspectRatioResponsiveProps>(
  function AspectRatio(props, ref) {
    const { ratio = 4 / 3, children, ...rest } = props;

    // enforce single child
    const child = React.Children.only(children);

    return (
      <ChakraDiv
        ref={ref}
        position="relative"
        _before={{
          height: 0,
          content: `""`,
          display: 'block',
          paddingBottom: mapResponsive(ratio, (r) => `${(1 / r) * 100}%`),
        }}
        css={{
          '& > *': {
            overflow: 'hidden',
            position: 'absolute',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          },
          '& > img, & > video': {
            objectFit: 'cover',
          },
        }}
        {...rest}
      >
        {child}
      </ChakraDiv>
    );
  }
);

export default AspectRatioResponsive;
