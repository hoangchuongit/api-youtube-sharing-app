import { userDetailMock } from '@modules/users/__mock__/user.mock';
import {
  IPostItemResponse,
  IPostListResponse,
  IPostShareYoutubeInput,
  IPostShareYoutubeResponse,
  IPostUserItemResponse,
} from '../interfaces/posts.interface';

export const postShareYoutubeInputMock: IPostShareYoutubeInput = {
  link: 'https://www.youtube.com/watch?v=Bn75IkUyhMo',
};

export const postShareYoutubeResponseMock: IPostShareYoutubeResponse = {
  id: '660864fe15ff351fd49c45d2',
  link: 'https://www.youtube.com/watch?v=lV1OOlGwExM&t=21s',
  title: 'Godzilla x Kong : The New Empire | Official Trailer',
  description:
    'Legendary Pictures’ cinematic Monsterverse follows up the explosive showdown of “Godzilla vs. Kong” with an all-new adventure that pits the almighty Kong and the fearsome Godzilla against a colossal undiscovered threat hidden within our world, challenging their very existence—and our own. “Godzilla x Kong: The New Empire” delves further into the histories of these Titans and their origins, as well as the mysteries of Skull Island and beyond, while uncovering the mythic battle that helped forge these extraordinary beings and tied them to humankind forever.\n\nOnce again at the helm is director Adam Wingard.  The film stars Rebecca Hall (“Godzilla vs. Kong,” The Night House”), Brian Tyree Henry (“Godzilla vs. Kong,” “Bullet Train”), Dan Stevens (“Gaslit,” “Legion,” “Beauty and the Beast”), Kaylee Hottle (“Godzilla vs. Kong”), Alex Ferns (“The Batman,” “Wrath of Man,” “Chernobyl”) and Fala Chen (“Irma Vep,” “Shang Chi and the Legend of the Ten Rings”).\n\nThe screenplay is by Terry Rossio (“Godzilla vs. Kong” the “Pirates of the Caribbean” series) and Simon Barrett (“You’re Next”) and Jeremy Slater (“Moon Knight”), from a story by Rossio & Wingard & Barrett, based on the character “Godzilla” owned and created by TOHO Co., Ltd..  The film is produced by Mary Parent, Alex Garcia, Eric Mcleod, Thomas Tull, Jon Jashni and Brian Rogers.  The executive producers are Wingard, Jen Conroy, Jay Ashenfelter, Yoshimitsu Banno, Kenji Okuhira. \n\nOnce again, Wingard is collaborating with director of photography Ben Seresin (“Godzilla vs. Kong,” “World War Z”), production designer Tom Hammock (“Godzilla vs. Kong,” “X,” “The Guest”), editor Josh Schaeffer (“Godzilla vs. Kong,” “Molly’s Game”), costume designer Emily Seresin (“The Invisible Man,” “Top of the Lake”).  The composers are Tom Holkenborg (“Godzilla vs. Kong,” “Mad Max: Fury Road”) and Antonio Di Iorio (additional music on “Godzilla vs. Kong,” the “Sonic the Hedgehog” films).\n\nWarner Bros. Pictures and Legendary Pictures Present a Legendary Pictures Production, A Film By Adam Wingard, “Godzilla x Kong: The New Empire.”  It is slated for release nationwide only in theaters and IMAX on March 29, 2024, distributed by Warner Bros. Pictures except in Japan, where the film will be distributed by Toho Co., Ltd and in mainland China, where it will be distributed by Legendary East.',
};

export const postUserResponseMock: IPostUserItemResponse = {
  id: userDetailMock.id,
  fullName: userDetailMock.fullName,
};

export const postItemResponseMock: IPostItemResponse = {
  id: postShareYoutubeResponseMock.id,
  link: postShareYoutubeResponseMock.link,
  title: postShareYoutubeResponseMock.title,
  description: postShareYoutubeResponseMock.description,
  user: postUserResponseMock,
};

export const postListResponseMock: IPostListResponse = {
  count: 1,
  items: [postItemResponseMock],
};
