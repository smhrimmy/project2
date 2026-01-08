import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import colors from 'web-check-live/styles/colors';
import { type InputSize, applySize } from 'web-check-live/styles/dimensions';

type LoadState = 'loading' | 'success' | 'error';

// Extend standard button props
interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  children: ReactNode;
  size?: InputSize;
  bgColor?: string;
  fgColor?: string;
  styles?: string | object; // Allow string (CSS) or object (style prop)
  title?: string; // Override standard title to be optional string
  loadState?: LoadState;
}

// Props specifically for the styled component
interface StyledButtonProps {
  size?: InputSize;
  bgColor?: string;
  fgColor?: string;
  customStyles?: string; // Renamed from styles to avoid conflict
}

const StyledButton = styled.button<StyledButtonProps>`
  cursor: pointer;
  border: none;
  border-radius: 0.25rem;
  font-family: PTMono;
  box-sizing: border-box; 
  width: -moz-available;
  display: flex;
  justify-content: center;
  gap: 1rem;
  box-shadow: 3px 3px 0px ${colors.fgShadowColor};
  
  &:hover {
    box-shadow: 5px 5px 0px ${colors.fgShadowColor};
  }
  &:active {
    box-shadow: -3px -3px 0px ${colors.fgShadowColor};
  }
  &:disabled {
    opacity: 0.5;
    pointer-events: none;
    box-shadow: none;
  }

  ${props => applySize(props.size)};
  
  ${(props) => props.bgColor ?
    `background: ${props.bgColor};` : `background: ${colors.primary};`
  }
  
  ${(props) => props.fgColor ?
    `color: ${props.fgColor};` : `color: ${colors.background};`
  }
  
  ${props => props.customStyles || ''}
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SimpleLoader = styled.div`
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid ${colors.background};
  width: 1rem;
  height: 1rem;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Loader = ({ loadState }: { loadState: LoadState }) => {
  if (loadState === 'loading') return <SimpleLoader />;
  if (loadState === 'success') return <span>✔</span>;
  if (loadState === 'error') return <span>✗</span>;
  return <span></span>;
};

const Button = (props: ButtonProps): JSX.Element => {
  const { 
    children, 
    size, 
    bgColor, 
    fgColor, 
    styles, 
    loadState, 
    ...rest 
  } = props;

  // Handle styles prop: if it's a string, pass as customStyles, if object pass as style
  const customStyles = typeof styles === 'string' ? styles : undefined;
  const inlineStyle = typeof styles === 'object' ? styles : undefined;

  return (
    <StyledButton
      size={size}
      bgColor={bgColor}
      fgColor={fgColor}
      customStyles={customStyles}
      style={inlineStyle}
      {...rest}
    >
      { loadState && <Loader loadState={loadState} /> }
      {children}
    </StyledButton>
  );
};

export default Button;
