import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  Column,
  Equal,
  ILike,
  In,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Post('users')
  async spostUsers() {
    for (let i = 0; i < 100; i++) {
      await this.userRepository.save({
        email: `user-${i}@google.com`,
      });
    }
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    // const user1 = this.userRepository.create({
    //   email: '123412@sadf1.asdf'
    // })

    //저장
    const user2 = await this.userRepository.save({
      email: '123412@sadf1.asdf',
    });

    //preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    //추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함,
    // 저장하지는 않음
    // const user3 = await this.userRepository.preload({
    //   id: 101,
    //   email: 'asdf'
    // })

    // 삭제하기
    // await this.userRepository.delete(101)

    // 값 증가시키기 감소는 decrement()
    // await this.userRepository.increment(
    //   {
    //     id: 1,
    //   },
    //   'count',
    //   2,
    // );

    // 갯수 카운팅하기
    // const count = await this.userRepository.count({
    //   where: {
    //     email: ILike('%0%'),
    //   },
    // });

    // sum
    // const sum = await this.userRepository.sum('count', {
    //   email:ILike('%0%')
    // })

    // average
    // const average = await this.userRepository.average('count', {email:ILike('%0%')})

    //최소값: min, 최대값은 max
    
    // find()
    // findone()

    // 페이지네이션 할때 사용
    const usersAndCount = await this.userRepository.findAndCount({
      take:3
    })
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      where: {
        // 아닌경우 가져오기
        // id: Not(1)
        // 적은 경우 가져오기
        // id: LessThan(30)
        // 작거나 같은 경우
        // id: LessThanOrEqual(30)
        // 많은 경우
        // id: MoreThan(30)
        // 많거나 같은 경우
        // id: MoreThanOrEqual(30)
        // 같은 경우
        // id: Equal(30)
        // 유사값
        // email: Like('%google%')
        // 대소문자 구분없는 유사값
        // email: ILike('%google%')
        // 사이값
        // id: Between(10, 15)
        // 해당되는 여러개의 값
        // id: In([1,3,4])
        // 널값인 경우
        // id: IsNull()
      },
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다.
      // 만약에 select를 정의하지 않으면
      // select를 정의하면 정의된 프로퍼티들만 가져오게
      // select:{},
      //필터링할 조건을 입력하게 된다.

      // // 관계를 가져오는 법
      // relations:{

      // },
      // // 오름차ASC / 내림차 DESC
      // order:{

      // },
      // //처음 몇개를 제외할지
      // skip:0,
      // // 몇개를 가져올지
      // take:1,
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
    });
  }

  @Delete('users/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('users/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@asdfg.ai',
      profile: {
        profileImg: 'asdf.png',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.png',
    //   user,
    // });

    return user;
  }

  @Post('users/post')
  async createUserAndPost() {
    const user = await this.userRepository.save({
      email: '1234@1234.asdf',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });

    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }

  @Column({
    default: 0,
  })
  count: number;
}
