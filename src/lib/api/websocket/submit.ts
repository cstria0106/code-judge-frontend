import type api from '@code-judge/api';

export type DetailSubmit = {
  id: string;
  language: api.functional.submit.list.Output['submits'][number]['language'];
  status: api.functional.submit.list.Output['submits'][number]['status'];
  createdAt: Date;
  code: string;
  problem: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
};

export type InitialSubmit = Pick<
  DetailSubmit,
  'id' | 'status' | 'createdAt' | 'problem' | 'language' | 'user'
>;

export type UpdateSubmit = Pick<DetailSubmit, 'id' | 'status'>;

export type SubmitSubscribeEvent =
  | {
      event: 'get/submit/initial';
      data: {
        submits: InitialSubmit[];
        count: number;
      };
    }
  | {
      event: 'get/submit/update';
      data: {
        submit: UpdateSubmit;
      };
    }
  | {
      event: 'get/submit/detail';
      data: {
        submit: DetailSubmit;
      };
    };
