const {weapi} = require('../util');
const http = require('../http');

module.exports = router => {
  router.get('/getCommentHot', async (req, res) => {
    const {id, type, limit} = req.query;
    const types = {
      0: 'R_SO_4_', //  歌曲
      1: 'R_MV_5_', //  MV
      2: 'A_PL_0_', //  歌单
      3: 'R_AL_3_', //  专辑
      4: 'A_DJ_1_', //  电台,
      5: 'R_VI_62_' //  视频
    };
    const data = {
      rid: id,
      limit: limit || 20,
      offset: 0
    };
    try {
      const response = await http({
        method: 'POST',
        url: `weapi/v1/resource/hotcomments/${types[type]}${id}`,
        data: weapi(data)
      });
      const hotComments = response.data.hotComments ? response.data.hotComments.map(item => ({
        content: item.content,
        likedCount: item.likedCount,
        user: {
          name: item.user.nickname,
          avatarUrl: item.user.avatarUrl
        }
      })) : [];
      res.status(200).send(hotComments);
    } catch(err) {
      res.status(500).send(err.message);
    }
  });
};