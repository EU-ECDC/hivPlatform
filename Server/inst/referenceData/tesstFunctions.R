list(
  function(x) {
    if (any(duplicated(x))) {
      return('Column `RecordId` has non-unique values')
    } else {
      return(NULL)
    }
  }
)
