import { type IMedia } from "./media.dto";
import * as mediaService from "./media.service";
import { GraphQLUpload } from 'graphql-upload';
import { type Context } from '../types'; // Your context type definition

export const mediaResolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    uploadMedia: async (
      _: unknown,
      { file, userId }: { file: any, userId: string },
      { user }: Context
    ): Promise<IMedia> => {
      if (!user) {
        throw new Error('Unauthorized');
      }

      return await mediaService.uploadMedia(file, userId);
    },
  },
};
