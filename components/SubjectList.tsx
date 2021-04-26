import SubjectListProvider, {
  useSubjectListMethods,
  useSubjectListStates,
} from '@packages/features/subject-list-context';
import { Button } from '@chakra-ui/button';
import { AddIcon, CheckIcon, CloseIcon, MinusIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Text, Stack } from '@chakra-ui/layout';
import { useState } from 'react';
import { Submittable } from '../interfaces';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/table';

interface Props extends Submittable {}

function SubjectListInput({ onSubmit }: Props) {
  const { addItem } = useSubjectListMethods();
  const [inputValue, setInputValue] = useState('');
  const handleSubmit = () => {
    setInputValue('');
    addItem(inputValue);
    onSubmit?.();
  };
  const handleCancel = () => setInputValue('');

  return (
    <InputGroup margin="1rem 0">
      <Input
        type="text"
        placeholder="Adicione um tema"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />

      {inputValue.length > 0 && (
        <InputRightElement width="6rem">
          <Stack direction="row" spacing={2}>
            <Button
              size="sm"
              colorScheme="teal"
              variant="ghost"
              onClick={handleSubmit}
            >
              <CheckIcon />
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={handleCancel}
            >
              <CloseIcon />
            </Button>
          </Stack>
        </InputRightElement>
      )}
    </InputGroup>
  );
}

function SubjectListTable() {
  const { subjects } = useSubjectListStates();
  if (subjects.length === 0)
    return (
      <Text textAlign="center">
        😅 Oops, nenhuma tema foi sugerido ainda...
      </Text>
    );
  return (
    <Table variant="simple">
      <TableCaption>Sugestões de temas - Meetups PodCodar</TableCaption>
      <Thead>
        <Tr>
          <Th>Tema</Th>
          <Th isNumeric>Votes</Th>
        </Tr>
      </Thead>
      <Tbody>
        {subjects.map(({ text, votes, vote, voted }) => (
          <Tr key={text}>
            <Td>
              <p>{text}</p>
              <Button
                size="xs"
                colorScheme="teal"
                variant="ghost"
                disabled={voted != null}
                onClick={() => vote('up')}
              >
                <AddIcon fontSize="0.5rem" />
              </Button>
              <Button
                size="xs"
                colorScheme="red"
                variant="ghost"
                disabled={voted != null}
                onClick={() => vote('down')}
              >
                <MinusIcon fontSize="0.5rem" />
              </Button>
            </Td>
            <Td isNumeric>{votes} votes</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

function SubjectList() {
  return (
    <SubjectListProvider>
      <SubjectListInput />

      <SubjectListTable />
    </SubjectListProvider>
  );
}

export default SubjectList;
