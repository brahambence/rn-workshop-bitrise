import { render } from '@testing-library/react-native';
import React from 'react';
import { IQuiz } from '../interfaces';
import { Game } from '../screens';
import { IProps } from '../screens/Game';
import { mockResponse } from './App.test';

jest.mock('../utils/helpers', () => {
    const og = jest.requireActual('../utils/helpers');
    return {
        ...og,
        shuffle: jest.fn(arr => arr),
    }
});

const props: IProps = {
    currentIndex: 0,
    isLoading: false,
    lives: 3,
    questions: [],
    handleAnswerSelected: jest.fn(),
    onResetGame: jest.fn(),
}

describe('Game', () => {
    it("should match snapshot by default", () => {
        const {toJSON} = render(<Game {...props}/>);
        expect(toJSON()).toMatchSnapshot();
    });

    it("should match snapshot while loading", () => {
        const {toJSON} = render(<Game {...props} isLoading={true}/>);
        expect(toJSON()).toMatchSnapshot();
    })

    it("should match snapshot with questions", () => {
        const question: IQuiz = 
        {
            question: 'Do you enjoy this workshop?',
            correct_answer: "YES",
            incorrect_answers: ['No', 'Maybe', 'Not really'],
            category: "technology",
            difficulty: "easy",
            type: "multiple",
        }
        const {toJSON} = render(<Game {...props} questions={[question]} />);
        
        expect(toJSON()).toMatchSnapshot();
    })
})