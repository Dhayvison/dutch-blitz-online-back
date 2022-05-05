import { Router } from 'express';
import * as path from 'path';

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.resolve('./index.html'));
});

export { router };
