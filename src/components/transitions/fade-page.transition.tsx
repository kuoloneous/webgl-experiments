import React from 'react';
import {
  TransitionGroup,
  Transition as ReactTransition,
} from 'react-transition-group';

interface Props {
  children: React.ReactNode,
  location: React.ReactText
}

const TIMEOUT = 300;
const getTransitionStyles = {
  entering: {
    position: 'absolute',
    opacity: 0,
  },
  entered: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 1,
  },
  exiting: {
    transition: `opacity ${TIMEOUT}ms ease-in-out`,
    opacity: 0,
  },
};

const FadePageTransition = ({ children, location }: Props) => (
  <TransitionGroup style={{ position: 'relative' }}>
    <ReactTransition
      key={location}
      timeout={{
        enter: TIMEOUT,
        exit: TIMEOUT,
      }}
    >
      { (status) => (
        <div
          style={{
            ...getTransitionStyles[status],
          }}
        >
          {children}
        </div>
      )}
    </ReactTransition>
  </TransitionGroup>
);

export default FadePageTransition;
