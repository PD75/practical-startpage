angular.module('ps.badges', [])
  .constant('badgeConstants', {
    badges: {
      gmail: {
        icon: "star",
        directive: "gmail",
        edit: {
          type: "directive",
          directive: "edit-bookmarks",
        },
      },
    },
  });
