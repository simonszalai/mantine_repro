## UX

1. Date in client schedular repeated items column defaults to today, and if the date in URL is a different day, jumps
   there after loading. Either get the value earlier or add a skeleton
2. Confirm delete button in table too easily disappears -> open on click, add cancel button
3. Weird bug when dragging handles outside of boundaries and there is another block in the row

## Tech Debt

1. De-duplicate scheduleitem creation from clients/new and library.new route
2. Remove flattening data structures
3. Cull reducers from components and submit forms directly (maybe not?)
