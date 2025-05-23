import * as React from "react";
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { Newsletter } from "@/types";

const Email = ({ productsOfTheDay, productsOfTheWeek }: Newsletter) => {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Your daily Product Hunt TL;DR - Fresh launches and top products
      </Preview>
      <Tailwind>
        <Body
          className="bg-black text-white font-sans py-[40px]"
          style={{
            background:
              "linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)",
          }}
        >
          <Container className="max-w-[600px] mx-auto bg-transparent rounded-[16px] overflow-hidden">
            {/* Header with Logo */}
            <Section className="bg-transparent px-[32px] py-[40px] text-center">
              <Img
                src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/debutism/debutism_logo.png"
                width="160"
                height="48"
                alt="debutism logo"
                className="mx-auto mb-[8px] w-[160px] h-auto object-contain"
              />
              <Text className="text-[#a0a0a0] text-[16px] mt-[16px] mb-0 font-normal">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Text>
            </Section>

            {/* Yesterday's Launches */}
            <Section className="px-[32px] py-[32px] bg-transparent">
              <Heading
                className="text-[22px] max-w-[600px] font-black text-white mb-[32px] mt-0"
                style={{ fontSize: "min(22px, 5vw)" }}
              >
                Yesterday's Product Launches
              </Heading>

              {productsOfTheDay.map((post) => (
                <Section
                  key={post.name}
                  className="rounded-[12px] mb-[24px] overflow-hidden shadow-[0px_8px_16px_rgba(0,0,0,0.2)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Row className="p-[24px]">
                    <Column className="w-[80px] pr-[20px] align-top">
                      <Img
                        src={post.thumbnail.url}
                        width="64"
                        height="64"
                        alt={`${post.name} Logo`}
                        className="w-full h-auto object-cover rounded-[8px]"
                      />
                    </Column>
                    <Column>
                      <Text className="text-[18px] font-black text-white m-0 uppercase">
                        {post.name}
                      </Text>
                      <Text className="text-[14px] text-[#a0a0a0] mt-[8px] mb-[16px]">
                        {post.tagline}
                      </Text>
                      <Row>
                        <Column className="w-auto">
                          <Button
                            href={post.url}
                            className="bg-transparent border border-white text-[#a0a0a0] px-[14px] py-[8px] text-[14px] font-black rounded-xl inline-block"
                            style={{
                              border: "1px solid #a0a0a0",
                              borderRadius: "12px",
                            }}
                          >
                            <span>Visit website</span>
                          </Button>
                        </Column>
                        <Column className="w-auto">
                          <Text className="text-[14px] font-medium text-[#a0a0a0] m-0 pl-[16px] py-[8px] inline-block">
                            ▲ {post.votesCount}
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            {/* Top Products of Last Week */}
            <Section className="px-[32px] py-[32px] bg-transparent">
              <Heading
                className="text-[22px] max-w-[600px] font-black text-white mb-[32px] mt-0 uppercase"
                style={{ fontSize: "min(22px, 5vw)" }}
              >
                Top Products of Last Week
              </Heading>

              {productsOfTheWeek.map((post) => (
                <Section
                  key={post.name}
                  className="rounded-[12px] mb-[24px] overflow-hidden shadow-[0px_8px_16px_rgba(0,0,0,0.2)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Row className="p-[24px]">
                    <Column className="w-[80px] pr-[20px] align-top">
                      <Img
                        src={post.thumbnail.url}
                        width="64"
                        height="64"
                        alt={`${post.name} Logo`}
                        className="w-full h-auto object-cover rounded-[8px]"
                      />
                    </Column>
                    <Column>
                      <Text className="text-[18px] font-black text-white m-0 uppercase">
                        {post.name}
                      </Text>
                      <Text className="text-[14px] text-[#a0a0a0] mt-[8px] mb-[16px]">
                        {post.tagline}
                      </Text>
                      <Row>
                        <Column className="w-auto">
                          <Button
                            href={post.url}
                            className="bg-transparent border border-white text-[#a0a0a0] px-[14px] py-[8px] text-[14px] font-black rounded-xl inline-block"
                            style={{
                              border: "1px solid #a0a0a0",
                              borderRadius: "12px",
                            }}
                          >
                            <span>Visit website</span>
                          </Button>
                        </Column>
                        <Column className="w-auto">
                          <Text className="text-[14px] font-medium text-[#a0a0a0] m-0 pl-[16px] py-[8px] inline-block">
                            ▲ {post.votesCount}
                          </Text>
                        </Column>
                      </Row>
                    </Column>
                  </Row>
                </Section>
              ))}
            </Section>

            {/* Footer */}
            <Section className="px-[32px] py-[40px] text-center bg-transparent">
              <Text className="text-[14px] mb-[24px] font-medium text-white">
                Stay updated with the latest product launches every day!
              </Text>
              <Text className="text-[12px] text-[#a0a0a0] m-0">
                &copy; {new Date().getFullYear()} debutism
              </Text>
              <Text className="text-[12px] text-[#a0a0a0] mt-[16px] mb-0">
                <Link
                  href="{{{RESEND_UNSUBSCRIBE_URL}}}"
                  className="text-[#a0a0a0] underline"
                >
                  Unsubscribe
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default Email;
