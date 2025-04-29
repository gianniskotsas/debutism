import * as React from 'react';
import {
  Body,
  Button,
  Column,
  Container,
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
} from '@react-email/components';
import { Newsletter } from '@/types';

const Email = ({ productsOfTheDay, productsOfTheWeek }: Newsletter) => {
  return (
    <Html>
      <Head />
      <Preview>Your daily Product Hunt TL;DR - Fresh launches and top products</Preview>
      <Tailwind>
        <Body className="bg-[#f0f5f1] font-sans py-[40px]">
          <Container className="max-w-[600px] mx-auto bg-white rounded-xl overflow-hidden border-[6px] border-black">
            {/* Header with Logo */}
            <Section className="bg-black px-[24px] py-[32px] text-center">
              <Img
                src="https://glhckkdhdbpinqmzpcqs.supabase.co/storage/v1/object/public/thumbnails/debutism/debutism_logo.png"
                width="160"
                height="48"
                alt="debutism logo"
                className="mx-auto mb-[8px] w-[160px] h-auto object-contain"
              />
              <Text className="text-[#e9f0ea] text-[16px] mt-[8px] mb-0 font-normal">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </Section>

            {/* Yesterday's Launches */}
            <Section className="px-[24px] py-[32px] bg-white border-t-[6px] border-black">
              <Heading className="text-[24px] max-w-[600px] font-black text-black mb-[24px] mt-0 uppercase border-b-[6px] border-black pb-[8px]" style={{ fontSize: 'min(24px, 5vw)' }}>
                Yesterday's Product Launches 🚀
              </Heading>

              {/* Product 1 */}
              {productsOfTheDay.map((post) => (
              <Section key={post.name} className="border-[4px] border-black rounded-xl mb-[32px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Row className="p-[16px] bg-[#f0f5f1]">
                  <Column className="w-[80px] pr-[16px] align-top">
                    <Img
                      src={post.thumbnail.url}
                      width="64"
                      height="64"
                      alt="Product 1 Logo"
                      className="w-full h-auto object-cover border-[4px] border-black"
                    />
                  </Column>
                  <Column>
                    <Text className="text-[18px] font-black text-black m-0 uppercase">{post.name}</Text>
                    <Text className="text-[14px] text-black mt-[4px] mb-[16px]">
                      {post.tagline}
                    </Text>
                    <Row>
                      <Column className="w-auto">
                        <Button
                          href={post.url}
                          className="bg-transparent text-black py-[8px] text-[14px] font-black box-border border-[4px] border-black uppercase inline-block"
                        >
                          <span style={{
                            textUnderlineOffset: '4px',
                            textDecorationColor: 'black',
                            textDecorationThickness: '2px'
                          }} className="underline">Visit website ↗</span>
                        </Button>
                      </Column>
                      <Column className="w-auto">
                        <Text className="text-[14px] font-bold text-black m-0 pl-[4px] py-[8px] inline-block">
                          ▲ {post.votesCount} upvotes
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Section>
              ))}
            </Section>

            {/* Top Products of Last Week */}
            <Section className="px-[24px] py-[32px] border-t-[6px] border-black">
              <Heading className="text-[24px] max-w-[600px] font-black text-black mb-[24px] mt-0 uppercase border-b-[6px] border-black pb-[8px]" style={{ fontSize: 'min(24px, 5vw)' }}>
                Top Products of Last Week 🏆
              </Heading>

              {/* Top Product 1 */}
              {productsOfTheWeek.map((post) => (
              <Section key={post.name} className="border-[4px] border-black rounded-xl mb-[32px] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <Row className="p-[16px] bg-[#f0f5f1]">
                  <Column className="w-[80px] pr-[16px] align-top">
                    <Img
                      src={post.thumbnail.url}
                      width="64"
                      height="64"
                      alt="Top Product 1 Logo"
                      className="w-full h-auto object-cover border-[4px] border-black"
                    />
                  </Column>
                  <Column>
                    <Text className="text-[18px] font-black text-black m-0 uppercase">{post.name}</Text>
                    <Text className="text-[14px] text-black mt-[4px] mb-[16px]">
                      {post.tagline}
                    </Text>
                    <Row>
                      <Column className="w-auto">
                        <Button
                          href={post.url}
                          className="bg-transparent text-black py-[8px] text-[14px] font-black box-border border-[4px] border-black uppercase inline-block"
                        >
                          <span style={{
                            textUnderlineOffset: '4px',
                            textDecorationColor: 'black',
                            textDecorationThickness: '2px'
                          }} className="underline">Visit website ↗</span>
                        </Button>
                      </Column>
                      <Column className="w-auto">
                        <Text className="text-[14px] font-bold text-black m-0 pl-[4px] py-[8px] inline-block">
                          ▲ {post.votesCount} upvotes
                        </Text>
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </Section>
              ))}
            </Section>

            {/* Footer */}
            <Section className="px-[24px] py-[32px] text-center bg-black text-white border-t-[6px] border-black">
              <Text className="text-[14px] mb-[8px] font-bold uppercase">
                Stay updated with the latest product launches every day!
              </Text>
             
              <Text className="text-[12px] text-[#e9f0ea] m-0">
                &copy; {new Date().getFullYear()} debutism
              </Text>
              <Text className="text-[12px] text-[#e9f0ea] mt-[16px] mb-0">
                <Link href="https://example.com/unsubscribe" className="text-[#e9f0ea] underline">
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