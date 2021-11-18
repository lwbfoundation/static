import React, {
  FunctionComponent,
  Suspense,
  useState,
  useRef,
  lazy,
  useEffect,
} from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Text, Button, ButtonProps } from '@chakra-ui/react';
import { DonateForm } from './donate-form';
import PostBody from './post-body';

const LazyNewsletterSignup = lazy(
  () => import('./newsletter-signup/newsletter-signup')
);

type HeaderButtonProps = ButtonProps & {
  readonly isSelected?: boolean;
};

const selectedStyle = {
  borderColor: 'gray.200',
};

export const HeaderButton: FunctionComponent<HeaderButtonProps> = ({
  isSelected,
  ...rest
}) => {
  return (
    <Button
      {...(isSelected && selectedStyle)}
      fontSize={[12, 16]}
      backgroundColor="mint.brand"
      _hover={{
        backgroundColor: 'mint.brandlight',
      }}
      _active={{
        backgroundColor: 'mint.branddark',
      }}
      borderRadius={0}
      paddingTop={1}
      height={7}
      marginX={1}
      display="inline-block"
      minWidth={[null, 150]}
      textTransform="uppercase"
      fontFamily="Edmond Sans, Helvetica"
      {...rest}
    />
  );
};

// eslint-disable-next-line no-shadow
export enum FormsState {
  none = 0,
  donate,
  newsletterSignup,
}

type FormsContainerProps = {
  initialState?: FormsState;
};

const FormsContainer: FunctionComponent<FormsContainerProps> = ({
  initialState = FormsState.none,
}) => {
  const data = useStaticQuery(graphql`
    query {
      wpCommonSiteSettings {
        customCommonDataFields {
          donateformexplainer
          newslettersignupexplainer
          legalinfo
        }
      }
    }
  `);

  const [openForm, setOpenForm] = useState(initialState);
  const formsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setOpenForm(initialState);
  }, [initialState]);

  useEffect(() => {
    if (openForm !== FormsState.none)
      formsContainerRef.current?.scrollIntoView(true);
  }, [openForm, formsContainerRef]);

  return (
    <Box
      ref={formsContainerRef}
      position="relative"
      marginX="auto"
      zIndex={2}
      width={['auto', 'calc(100% - 1rem)']}
      maxWidth={600}
      borderRadius={10}
      marginTop={8}
      marginBottom={openForm === FormsState.none ? 0 : 16}
    >
      {openForm === FormsState.donate && <DonateForm />}
      {openForm === FormsState.newsletterSignup && (
        <Suspense fallback={<Box height={600} />}>
          <Box
            backgroundColor="#F4F9F9"
            paddingX={[2, 8]}
            paddingY={6}
            borderRadius={[0, 10]}
          >
            <Text as="div" fontSize={['1em', '1.4em']} marginBottom={4}>
              <PostBody
                body={
                  data.wpCommonSiteSettings.customCommonDataFields
                    .newslettersignupexplainer
                }
              />
            </Text>
            <LazyNewsletterSignup signupButtonText="Sign up" />
          </Box>
        </Suspense>
      )}
    </Box>
  );
};

export default FormsContainer;
