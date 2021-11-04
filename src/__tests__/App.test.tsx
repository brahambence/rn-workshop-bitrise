import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react-native";
import App from "../App"
import { maxLives, maxQuestions } from "../config";
import fetch from 'jest-fetch-mock';
import { IResponse } from "../interfaces";

export const mockResponse: IResponse = {
    response_code: 0,
    results: [
        {
            question: 'Do you enjoy this workshop?',
            correct_answer: "YES",
            incorrect_answers: ['No', 'Maybe', 'Not really'],
            category: "technology",
            difficulty: "easy",
            type: "multiple",
        }
    ]
}

describe("App", () => {
    beforeEach(() => {
        fetch.mockResponse(JSON.stringify(mockResponse));
    });
    it("should all lives by default", async () => {
        const {findAllByTestId} = render(<App/>);
        const hearts = await findAllByTestId("heart-full");

        expect(hearts).toHaveLength(maxLives);
    });
    it("should show first step text", async () => {
        const {findByTestId} = render(<App/>);
        const currentStep = await findByTestId("currentStep");

        expect(currentStep.props.children).toEqual(`1 / ${maxQuestions}`);
    });
    it("should lose life with incorrect answer", async () => {
        const {findByTestId, getByText, getAllByTestId} = render(<App/>);
        const question = await findByTestId('question');
        
        expect(question.props.children).toEqual(mockResponse.results[0].question);

        const incorrectButton = getByText(mockResponse.results[0].incorrect_answers[0]);

        fireEvent.press(incorrectButton);

        const fullHearts = getAllByTestId('heart-full');
        expect(fullHearts).toHaveLength(maxLives - 1);
        
        const emptyHearts = getAllByTestId('heart-empty');
        expect(emptyHearts).toHaveLength(1);
    });
    it("should increase step number after correct answer", async() => {
        const {getByText, getByTestId} = render(<App/>);

        const correctButton = await waitFor(() => getByText(mockResponse.results[0].correct_answer));

        fireEvent.press(correctButton);

        const currentStep = await getByTestId('currentStep');

        expect(currentStep.props.children).toEqual(`2 / ${maxQuestions}`);
    });

})