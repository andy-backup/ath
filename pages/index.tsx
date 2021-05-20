import Head from 'next/head';
import { Image, Container, Heading, ListIcon, ListItem, OrderedList, Progress, HStack, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ISearch } from '../types/ISearch';
import { ICoin } from '../types/ICoin';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(weekOfYear);
dayjs.extend(advancedFormat);

const limit = 500;

export default function Home() {
  const [search, setSearch] = useState<ISearch>({ coins: [], exchanges: [], icos: [] });
  const [coins, setCoins] = useState(new Map<string, ICoin>());
  const [athToday, setAthToday] = useState<ICoin[]>([]);
  const [athWeek, setAthWeek] = useState<ICoin[]>([]);
  const [athMoon, setAthMoon] = useState<ICoin[]>([]);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get<ISearch>('https://api.coingecko.com/api/v3/search');
      setSearch(data);
    };
    getData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      let i = 0;
      search.coins.slice(0, limit).forEach(async (coin, index) => {
        try {
          await later(index * 1050);
          const { data } = await axios.get<ICoin>(
            `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
          );
          setCoins(coins.set(coin.id, data));
          setAthToday(getAth(search, coins, 1));
          setAthWeek(getAth(search, coins, 7));
          setAthMoon(getAth(search, coins, 30));
          setProgress(++i);
        } catch (e) {
          console.log(e);
        }
      });
    };
    getData();
  }, [search]);

  return (
    <Container p='5'>
      <Head>
        <title>ATH</title>
      </Head>
      <Progress value={(progress / limit) * 100} />({progress} / {limit})<Heading>本日新高</Heading>
      <OrderedList>
        {athToday.map(coin => (
          <ListItem key={coin.id}>
            <HStack>
              <Box>
                <Image src={coin.image.thumb} />
              </Box>
              <Box>
                {coin.name} ({coin.symbol})
              </Box>
            </HStack>
          </ListItem>
        ))}
      </OrderedList>
      <Heading>本周新高</Heading>
      <OrderedList>
        {athWeek.map(coin => (
          <ListItem key={coin.id}>
            <HStack>
              <Box>
                <Image src={coin.image.thumb} />
              </Box>
              <Box>
                {coin.name} ({coin.symbol})
              </Box>
            </HStack>
          </ListItem>
        ))}
      </OrderedList>
      <Heading>本月新高</Heading>
      <OrderedList>
        {athMoon.map(coin => (
          <ListItem key={coin.id}>
            <HStack>
              <Box>
                <Image src={coin.image.thumb} />
              </Box>
              <Box>
                {coin.name} ({coin.symbol})
              </Box>
            </HStack>
          </ListItem>
        ))}
      </OrderedList>
    </Container>
  );
}

function getAth(search: ISearch, coins: Map<string, ICoin>, day: number) {
  const ath: ICoin[] = [];
  const now = new Date().toISOString();
  for (const index in search.coins.slice(0, 99)) {
    const coin = search.coins[index];
    const coinMap = coins.get(coin.id);
    if (
      coinMap &&
      coinMap.market_data.ath_date.usd &&
      dayjs(coinMap.market_data.ath_date.usd).add(day, 'day').toDate().toISOString() >= now
    ) {
      ath.push(coinMap);
    }
  }
  return ath;
}

const later = (delay: number) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, delay);
  });
};
