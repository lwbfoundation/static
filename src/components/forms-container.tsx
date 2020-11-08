import React, { FunctionComponent, useState, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { Box, Text, Button, ButtonProps } from '@chakra-ui/core';
import PostBody from './post-body';
import Donate from './donate/donate';
import NewsletterSignup from './newsletter-signup/newsletter-signup';

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
enum FormsState {
  none = 1,
  donate,
  newsletterSignup,
}

const FormsContainer: FunctionComponent = () => {
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

  const [openForm, setOpenForm] = useState(FormsState.none);
  const formsContainerRef = useRef<HTMLElement>();
  const openFormAndScroll = (form: FormsState) => {
    setOpenForm(form);
    formsContainerRef.current?.scrollIntoView(true);
  };
  return (
    <Box
      ref={formsContainerRef}
      position="relative"
      marginX="auto"
      zIndex={2}
      marginTop={-20}
      width="calc(100% - 1rem)"
      maxWidth={520}
      borderRadius={10}
      paddingY={2}
      marginBottom={openForm === FormsState.none ? 0 : 20}
    >
      <Text as="div" textAlign="center" marginBottom={16}>
        <HeaderButton
          onClick={() => openFormAndScroll(FormsState.donate)}
          isSelected={openForm === FormsState.donate}
        >
          {data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext}
        </HeaderButton>
        <HeaderButton
          onClick={() => openFormAndScroll(FormsState.newsletterSignup)}
          isSelected={openForm === FormsState.newsletterSignup}
        >
          {
            data.wpCommonSiteSettings.customCommonDataFields
              .newslettersignupbuttontext
          }
        </HeaderButton>
      </Text>
      {openForm === FormsState.donate && (
        <>
          <Text fontSize="1.4em" marginBottom={4}>
            <PostBody
              body={
                data.wpCommonSiteSettings.customCommonDataFields
                  .donateformexplainer
              }
            />
          </Text>
          <Donate
            donateButtonText={
              data.wpCommonSiteSettings.customCommonDataFields.donatebuttontext
            }
          />
          <PostBody
            marginTop={8}
            body={data.wpCommonSiteSettings.customCommonDataFields.legalinfo}
          />
        </>
      )}
      {openForm === FormsState.newsletterSignup && (
        <>
          <Text fontSize="1.4em" marginBottom={4}>
            <PostBody
              body={
                data.wpCommonSiteSettings.customCommonDataFields
                  .newslettersignupexplainer
              }
            />
          </Text>
          <NewsletterSignup signupButtonText="Sign up" />
        </>
      )}
    </Box>
  );
};

export default FormsContainer;
