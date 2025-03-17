import { Fragment, FC, useEffect } from "react";
import type { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import Head from "next/head";
import { truncateString } from "@/helpers/utility";
import isURL from "validator/lib/isURL";
import { defaultEmbed } from "./api/oembed";

export const runtime = "experimental-edge";

// if they visit the URL directly, redirect them to my GitHub page instead :)
const redirectURL = defaultEmbed.provider_url;

type PartializedDiscordContentParameters = Partial<Record<"host" | "title" | "description" | "imageURL" | "videoURL" | "embedColor" | "authorText", string>>;

const isURLTrulyValid = (url: string) => isURL(url, {
  protocols: ["https"]
});

const Page: FC<InferGetServerSidePropsType<typeof getServerSideProps>> = (props) => {
  useEffect(() => {
    console.log(props);
  }, [])

  return (
    <Head>
      {/* <meta httpEquiv={"refresh"} content={`0; url=${redirectURL}`} /> */}

      <link rel="canonical" href={redirectURL} />

      {/* embed color */}
      {
        props?.embedColor?.length && (
          // goofy ahh function
          (() => {
            const isHexWithHashtag = /^#[0-9A-Fa-f]{6}$/gi;
            if (!props.embedColor.match(isHexWithHashtag)) return;

            return <meta name="theme-color" content={props.embedColor} />
          })()
        )
      }

      {/* title */}
      {
        props?.title && (
          <Fragment>
            <meta property="og:title" content={truncateString(props.title, 256)} />
            <meta name="twitter:title" content={truncateString(props.title, 256)} />
          </Fragment>
        )
      }

      {/* description */}
      {
        props?.description && (
          <Fragment>
            <meta property="description" content={truncateString(props.description, 1024)} />
            <meta property="og:description" content={truncateString(props.description, 1024)} />
            <meta name="twitter:description" content={truncateString(props.description, 1024)} />
          </Fragment>
        )
      }

      {/* video url */}
      {
        props?.videoURL && (
          <Fragment>
            <meta property="og:video" content={props.videoURL} />
            <meta property="og:video:secure_url" content={props.videoURL} />

            <meta name="twitter:card" content="player" />
            <meta name="twitter:player:stream" content={props.videoURL} />
            <meta name="twitter:player" content={props.videoURL} />

            <meta property="og:video:type" content={"video/mp4"} />
            <meta name="twitter:player:stream:content_type" content={"video/mp4"} />
            <meta name="twitter:image" content={"0"} />

            {/* coming soon: overriding the height and width of the embed */}
            {/* <meta property="og:video:width" content={String(props?.width)} /> */}
            {/* <meta property="og:video:height" content={String(props?.height)} /> */}
            {/* <meta name="twitter:player:width" content={String(props?.width)} /> */}
            {/* <meta name="twitter:player:height" content={String(props?.height)} /> */}
          </Fragment>
        )
      }

      {/* image url */}
      {
        props?.imageURL && (
          <Fragment>
            <meta property="og:image" content={props.imageURL} />
            <meta name="twitter:image" content={"0"} />
          </Fragment>
        )
      }

      {/* author text */}
      {
        props?.authorText && (
          <meta property="og:site_name" content={props.authorText} />
        )
      }

      <meta property="og:type" content="website" />
      <meta property="og:url" content={redirectURL} />

      <meta name="twitter:domain" content={"13373333.one"} />
      <meta name="twitter:url" content={redirectURL} />

      <link rel="alternate" href={`https://${props?.host}/api/oembed?text=${props?.description}&url=${redirectURL}`} type="application/json+oembed" title={props?.description || props.authorText || undefined}/>
    </Head>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext<PartializedDiscordContentParameters>) {
  const embedColor = (): string | null => {
    if (!ctx?.query?.embedColor) return null;

    const embedColor = String(ctx.query.embedColor);
    if (!embedColor?.length) return null;

    const isHexWithHashtag = /^#[0-9A-Fa-f]{6}$/gi;
    if (!embedColor.match(isHexWithHashtag)) return null;

    return embedColor;
  };

  return {
    props: {
      title: ctx?.query?.title ? truncateString(ctx.query.title as string, 256) : null,
      description: ctx?.query?.description ? truncateString(ctx.query.description as string, 1024) : null,
      imageURL: ctx?.query?.imageURL && isURLTrulyValid(ctx.query.imageURL as string) ? ctx.query.imageURL as string : null,
      videoURL: ctx?.query?.videoURL && isURLTrulyValid(ctx.query.videoURL as string) ? ctx.query.videoURL as string : null,
      embedColor: embedColor(),
      authorText: ctx?.query?.authorText ? truncateString(ctx.query.authorText as string, 256) : null,
      host: ctx?.req?.headers?.host
    }
  }
};

export default Page;