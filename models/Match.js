import { Schema, model } from 'mongoose';

const matchSchema = new Schema({
  source_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  target_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  seen: {
    type: Boolean,
    default: false,
  },
  status_match: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
});

matchSchema.statics.findMatchesForUser = async function (userId) {
  const matches = await this.find({
    $or: [{ target_user: userId }, { source_user: userId }],
    status_match: 'accepted',
  }).populate('source_user target_user');

  const dualMatches = matches.filter((match) => {
    return matches.some(
      (otherMatch) =>
        otherMatch.source_user.equals(match.target_user._id) &&
        otherMatch.target_user.equals(match.source_user._id) &&
        otherMatch.status_match === 'accepted',
    );
  });

  return dualMatches;
};

const Match = model('Match', matchSchema);

export default Match;
