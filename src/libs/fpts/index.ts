import { Task } from 'fp-ts/lib/Task';

const boolTask: Task<boolean> = async () => {
    try {
        await someAsyncFunction();
        return true;
    } catch (err) {
        return false;
    }
}

const someAsyncFunction = async () => await new Promise((resolve) => (setTimeout(resolve, 3000)));

boolTask();