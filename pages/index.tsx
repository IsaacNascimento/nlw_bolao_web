import Head from 'next/head';
import Image from 'next/image';

interface homeProps {
  count: number;
}

const Home = (props: homeProps) => {
  return (
   <h1>Contagem: {props.count}</h1>
  )
}

export const getServerSideProps = async () => {
  const response = await fetch('http://localhost:3333/pools/count');
  const data = await response.json();

  return {
    props: {
      count: data.count
    }
  }
}

export default Home;



