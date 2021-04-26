import { Button } from '@chakra-ui/button';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Stack } from '@chakra-ui/layout';
import { useState } from 'react';
import { Submittable } from '../interfaces';

interface Props extends Submittable {}

function SubjectListInput({ onSubmit }: Props) {
  const [inputValue, setInputValue] = useState('');
  const handleSubmit = () => {
    alert(inputValue);
    setInputValue('');
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

function SubjectList() {
  return (
    <div>
      <SubjectListInput />
    </div>
  );
}

export default SubjectList;
