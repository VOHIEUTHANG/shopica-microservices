using AutoMapper;
using Ratting.API.DTOs.Blogs;
using Ratting.API.DTOs.Comments;
using Ratting.API.Models;

namespace Ratting.API
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            DestinationMemberNamingConvention = new ExactMatchNamingConvention();

            CreateMap<Comment, CommentResponse>();
            CreateMap<CommentCreateRequest, Comment>();

            CreateMap<Blog, BlogResponse>();
            CreateMap<BlogCreateRequest, Blog>();
        }
    }
}
