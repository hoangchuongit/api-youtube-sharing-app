import { PostDocument } from '@modules/posts/entities/post.entity';
import { UserSchema } from './user.entity';
import { NextFunction } from 'express';
import { Model } from 'mongoose';

export const UserSchemaFactory = (postModel: Model<PostDocument>) => {
  const userSchema = UserSchema;

  userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
    // OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
    const user = await this.model.findOne(this.getFilter());
    await Promise.all([
      postModel
        .deleteMany({
          user: user._id,
        })
        .exec(),
      postModel
        .deleteMany({
          user: user._id,
        })
        .exec(),
    ]);
    return next();
  });
  return userSchema;
};
