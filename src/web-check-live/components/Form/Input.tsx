import { type InputHTMLAttributes, type ChangeEvent, type KeyboardEvent } from 'react';
import styled from '@emotion/styled';
import colors from 'web-check-live/styles/colors';
import { type InputSize, applySize } from 'web-check-live/styles/dimensions';

type Orientation = 'horizontal' | 'vertical';

// Extend standard input props
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  label?: string;
  size?: InputSize;
  orientation?: Orientation;
  // Support both handleChange and standard onChange
  handleChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface StyledInputProps {
  inputSize?: InputSize;
}

interface StyledContainerProps {
  orientation?: Orientation;
}

interface StyledLabelProps {
  inputSize?: InputSize;
}

const InputContainer = styled.div<StyledContainerProps>`
  display: flex;
  ${props => props.orientation === 'vertical' ? 'flex-direction: column;' : ''};
`;

const StyledInput = styled.input<StyledInputProps>`
  background: ${colors.background};
  color: ${colors.textColor};
  border: none;
  border-radius: 0.25rem;
  font-family: PTMono;
  box-shadow: 3px 3px 0px ${colors.backgroundDarker};
  &:focus {
    outline: 1px solid ${colors.primary}
  }

  ${props => applySize(props.inputSize)};
`;

const StyledLabel = styled.label<StyledLabelProps>`
  color: ${colors.textColor};
  ${props => applySize(props.inputSize)};
  padding: 0;
  font-size: 1.6rem;
`;

const Input = (props: InputProps): JSX.Element => {
  const { 
    id, 
    label, 
    size, 
    orientation, 
    handleChange, 
    onChange, 
    handleKeyDown, 
    ...rest 
  } = props;

  // Handler for change events
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) onChange(e);
    if (handleChange) handleChange(e);
  };

  return (
    <InputContainer orientation={orientation}>
      { label && <StyledLabel htmlFor={id} inputSize={size}>{ label }</StyledLabel> }
      <StyledInput
        id={id}
        inputSize={size}
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        {...rest}
      />
    </InputContainer>
  );
};

export default Input;
