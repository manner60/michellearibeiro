module.exports = (req, res) => {
  res.status(200).json({
    browsx_user_set: !!process.env.BROWSX_USER,
    browsx_pass_set: !!process.env.BROWSX_PASS,
    stripe_key_set: !!process.env.STRIPE_SECRET_KEY,
    webhook_secret_set: !!process.env.STRIPE_WEBHOOK_SECRET,
    user_length: process.env.BROWSX_USER ? process.env.BROWSX_USER.length : 0,
    pass_length: process.env.BROWSX_PASS ? process.env.BROWSX_PASS.length : 0
  });
};
