import { Request, Response } from "express";
import axios from "axios";
import {
  FilterCondition,
  SubmissionsQueryParams,
  ResponseFiltersType,
} from "../types/fillout.type";

const getFilteredResponses = async (req: Request, res: Response) => {
  const filloutApiBaseUrl = process.env.FILLOUT_API_BASEURL;
  const apiKey = process.env.FILLOUT_API_KEY;

  try {
    const formId = req.params.formId;
    const queryParams: SubmissionsQueryParams = req.query;

    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params: queryParams,
    };

    const response = await axios.get(
      `${filloutApiBaseUrl}/v1/api/forms/${formId}/submissions`,
      axiosConfig
    );

    const result = response.data.responses;

    if (queryParams.filters && queryParams.filters.length > 0) {
      const filteredResult = filterResponses(result, queryParams.filters);
      res.status(200).json(filteredResult);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const filterResponses = (
  responses: any[],
  filters: ResponseFiltersType
): any[] => {
  return responses.filter((response) => {
    return filters.every((filter) => {
      const question = response.questions.find((q: any) => q.id === filter.id);

      if (!question) {
        // If the question is not found in the response.questions, consider it as a non-match
        return false;
      }

      switch (filter.condition) {
        case FilterCondition.Equals:
          return areValuesEqual(question.value, filter.value);
        case FilterCondition.DoesNotEqual:
          return !areValuesEqual(question.value, filter.value);
        case FilterCondition.GreaterThan:
          return isValueGreaterThan(question.value, filter.value);
        case FilterCondition.LessThan:
          return isValueLessThan(question.value, filter.value);
        default:
          return false;
      }
    });
  });
};

const areValuesEqual = (value1: any, value2: any): boolean => {
  return value1 === value2;
};

const isValueGreaterThan = (value1: any, value2: any): boolean => {
  if (value1 === null || value2 === null) {
    return false;
  }

  return value1 > value2;
};

const isValueLessThan = (value1: any, value2: any): boolean => {
  if (value1 === null || value2 === null) {
    return false;
  }

  return value1 < value2;
};

export { getFilteredResponses };
