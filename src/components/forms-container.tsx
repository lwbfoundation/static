import React, {
  FunctionComponent,
  Suspense,
  useState,
  useRef,
  lazy,
  useEffect,
} from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Text, Button, ButtonProps } from '@chakra-ui/core';
import PostBody from './post-body';

const LazyDonate = lazy(() => import('./donate/donate'));
const LazyNewsletterSignup = lazy(
  () => import('./newsletter-signup/newsletter-signup')
);

type HeaderButtonProps = ButtonProps & {
  readonly isSelected?: boolean;
};

const selectedStyle = {
  backgroundColor: 'transparent',
  borderColor: 'gray.200',
};

const HeaderButton: FunctionComponent<HeaderButtonProps> = ({
  isSelected,
  ...rest
}) => {
  return (
    <Button
      color="white"
      backgroundColor="transparent"
      borderColor="gray.500"
      {...(isSelected && selectedStyle)}
      fontSize={[12, 16]}
      _hover={
        isSelected
          ? selectedStyle
          : {
              backgroundColor: 'transparent',
              borderColor: 'gray.400',
            }
      }
      borderRadius={0}
      borderBottomWidth={2}
      marginX={1}
      display="inline-block"
      minWidth={[null, 150]}
      fontWeight={200}
      textTransform="uppercase"
      letterSpacing={[1, 4]}
      fontFamily="Trade Gothic, Helvetica"
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
          donatebuttontext
          donateformexplainer
          newslettersignupbuttontext
          newslettersignupexplainer
          legalinfo
        }
      }
    }
  `);

  const [openForm, setOpenForm] = useState(initialState);
  const formsContainerRef = useRef<HTMLElement>();
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
      marginTop={-20}
      width={['auto', 'calc(100% - 1rem)']}
      maxWidth={600}
      borderRadius={10}
      paddingY={2}
      marginBottom={openForm === FormsState.none ? 0 : 20}
    >
      <Text as="div" textAlign="center" marginBottom={16}>
        <HeaderButton
          onClick={() => setOpenForm(FormsState.donate)}
          isSelected={openForm === FormsState.donate}
        >
          {data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext}
        </HeaderButton>
        <HeaderButton
          onClick={() => setOpenForm(FormsState.newsletterSignup)}
          isSelected={openForm === FormsState.newsletterSignup}
        >
          {
            data.wpCommonSiteSettings.customCommonDataFields
              .newslettersignupbuttontext
          }
        </HeaderButton>
      </Text>
      {openForm === FormsState.donate && (
        <Suspense fallback={<Box height={600} />}>
          <Box
            backgroundColor="#F4F9F9"
            paddingX={[2, 8]}
            paddingY={6}
            borderRadius={[0, 10]}
          >
            <Text as="div" fontSize={['1em', '1.4em']} marginBottom={8}>
              <PostBody
                body={
                  data.wpCommonSiteSettings.customCommonDataFields
                    .donateformexplainer
                }
              />
            </Text>
            <LazyDonate
              donateButtonText={
                data.wpCommonSiteSettings.customCommonDataFields
                  .donatebuttontext
              }
            />
            <Text marginTop={8} marginBottom={4}>
              Secure payments provided by{' '}
              <a href="https://www.stripe.com" rel="noreferrer" target="_blank">
                Stripe
              </a>
              .
            </Text>
            <PostBody
              body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
            />
          </Box>
        </Suspense>
      )}
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
