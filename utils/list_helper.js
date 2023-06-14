/* eslint-disable no-unused-vars */
const dummy = ( blogs ) => 1
  

const totalLikes = ( blogs ) => {
    const arrayOfLikes = blogs.map(blog => blog.likes);
    const plus = (accumulator, current) => accumulator + current;
    const result = arrayOfLikes.reduce(plus, 0);
    return result;
};

const maxLikes = ( blogs ) => {
    if (blogs.length === 0) return 0
    // else
    const bestBlg = (bestBlog, blog) => blog.likes > bestBlog.likes ? blog : bestBlog; 

    const { author, title, likes } = blogs.reduce(bestBlg, blogs[0]);
    console.log('Result of Max is', typeof result);
    return { author, title, likes };
}



module.exports = {
    totalLikes,
    maxLikes,
    dummy
    }
