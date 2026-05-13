const mongoose = require("mongoose");

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, "City name is required"],
      trim: true,
    },
    country: {
      type: String,
      trim: true, 
    },
    temperature: {
      type: Number,
    },
    condition: {
      type: String,
    },
    icon: {
      type: String,
    },
    searchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Keep only last 20 searches per user
searchHistorySchema.statics.addSearch = async function (userId, weatherData) {
  const count = await this.countDocuments({ user: userId });
  if (count >= 20) {
    const oldest = await this.find({ user: userId })
      .sort({ searchedAt: 1 })
      .limit(count - 19);
    await this.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }

  // Avoid duplicates - update if city searched recently (within 1hr)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const existing = await this.findOne({
    user: userId,
    city: { $regex: new RegExp(`^${weatherData.city}$`, "i") },
    searchedAt: { $gte: oneHourAgo },
  });

  if (existing) {
    existing.temperature = weatherData.temperature;
    existing.condition = weatherData.condition;
    existing.icon = weatherData.icon;
    existing.searchedAt = new Date();
    return existing.save();
  }

  return this.create({ user: userId, ...weatherData });
};

module.exports = mongoose.model("SearchHistory", searchHistorySchema);
