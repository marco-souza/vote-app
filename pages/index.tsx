import { Heading } from '@chakra-ui/react';
import Layout from '../components/Layout';
import SubjectList from '../components/SubjectList';

const IndexPage = () => (
  <Layout title="PodCodar Meetups - votação">
    <Heading margin="2rem 0">🗳 PodCodar Meetup - votes</Heading>

    <SubjectList />
  </Layout>
);

export default IndexPage;
