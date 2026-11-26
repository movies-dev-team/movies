
import type { PersonDetail } from "../../types/personDetail";

export const mockActor: PersonDetail = {
  id: 1892,
  name: "Matt Damon",
  biography: "Actor y guionista estadounidense.",
  birthday: "1970-10-08",
  place_of_birth: "Cambridge, Massachusetts, USA",
  profile_path: "/matt-damon.jpg",
  imdb_id: "nm0000354",
  known_for_department: "Acting",
  movie_credits: {
    cast: [
      {
        id: 2501,
        title: "The Bourne Identity",
        character: "Jason Bourne",
        poster_path: "/bourne.jpg",
        release_date: "2002-06-14",
      },
      {
        id: 286217,
        title: "The Martian",
        character: "Mark Watney",
        poster_path: "/martian.jpg",
        release_date: "2015-09-30",
      },
      {
        id: 157336,
        title: "Interstellar",
        character: "Dr. Mann",
        poster_path: null,
        release_date: "2014-11-07",
      },
    ],
    crew: [
      {
        id: 1001,
        title: "Producer Movie",
        poster_path: null,
        release_date: "2020-01-01",
        job: "Producer",
        department: "Production",
      },
    ],
  },
};

export const mockDirector: PersonDetail = {
  id: 525,
  name: "Christopher Nolan",
  biography: "Director y guionista británico.",
  birthday: "1970-07-30",
  place_of_birth: "London, England, UK",
  profile_path: "/christopher-nolan.jpg",
  imdb_id: "nm0634240",
  known_for_department: "Directing",
  movie_credits: {
    cast: [
      {
        id: 2001,
        title: "Acting Movie",
        character: "Self",
        poster_path: null,
        release_date: "2022-01-01",
      },
    ],
    crew: [
      {
        id: 157336,
        title: "Interstellar",
        poster_path: "/interstellar.jpg",
        release_date: "2014-11-07",
        job: "Director",
        department: "Directing",
      },
      {
        id: 27205,
        title: "Inception",
        poster_path: "/inception.jpg",
        release_date: "2010-07-16",
        job: "Director",
        department: "Directing",
      },
      {
        id: 872585,
        title: "Oppenheimer",
        poster_path: "/oppenheimer.jpg",
        release_date: "2023-07-21",
        job: "Director",
        department: "Directing",
      },
      {
        id: 2002,
        title: "Producer Movie",
        poster_path: null,
        release_date: "2021-01-01",
        job: "Producer",
        department: "Production",
      },
      {
        id: 2003,
        title: "Writer Movie",
        poster_path: null,
        release_date: "2020-01-01",
        job: "Writer",
        department: "Writing",
      },
    ],
  },
};